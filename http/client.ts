import { appEnv } from "@/constants/env";
import { supabase } from "@/lib/supabase/client";

type FetchLike = typeof fetch;
type ApiErrorHandler = (error: ApiError) => void | Promise<void>;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiClientOptions = {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
  getOrganizationId?: () => string | null;
  onForbidden?: ApiErrorHandler;
  onNetworkError?: ApiErrorHandler;
  onUnauthorized?: ApiErrorHandler;
  fetchFn?: FetchLike;
};

export type ApiClientHandlers = Pick<
  ApiClientOptions,
  "onForbidden" | "onNetworkError" | "onUnauthorized"
>;

let configuredHandlers: ApiClientHandlers = {};

export function configureApiClientHandlers(handlers: ApiClientHandlers) {
  configuredHandlers = handlers;

  return () => {
    configuredHandlers = {};
  };
}

export function buildApiUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function createAuthHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createOrganizationHeaders(
  organizationId: string | null,
): Record<string, string> {
  return organizationId ? { "x-organization-id": organizationId } : {};
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `HTTP ${response.status}`;

  try {
    const body = (await response.json()) as { message?: unknown };
    return typeof body.message === "string" ? body.message : fallback;
  } catch {
    return fallback;
  }
}

export function createApiClient({
  baseUrl,
  getAccessToken,
  getOrganizationId,
  onForbidden,
  onNetworkError,
  onUnauthorized,
  fetchFn = fetch,
}: ApiClientOptions) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getAccessToken();
    const headers = {
      Accept: "application/json",
      ...createAuthHeaders(token),
      ...createOrganizationHeaders(getOrganizationId?.() ?? null),
      ...init.headers,
    };
    const handlers = {
      ...configuredHandlers,
      onForbidden: onForbidden ?? configuredHandlers.onForbidden,
      onNetworkError: onNetworkError ?? configuredHandlers.onNetworkError,
      onUnauthorized: onUnauthorized ?? configuredHandlers.onUnauthorized,
    };

    let response: Response;

    try {
      response = await fetchFn(buildApiUrl(baseUrl, path), {
        ...init,
        headers,
      });
    } catch {
      const error = new ApiError("Network error. Check your connection.", 0);
      await handlers.onNetworkError?.(error);
      throw error;
    }

    if (!response.ok) {
      const error = new ApiError(
        await readErrorMessage(response),
        response.status,
      );

      if (response.status === 401) {
        await handlers.onUnauthorized?.(error);
      }

      if (response.status === 403) {
        await handlers.onForbidden?.(error);
      }

      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  return {
    get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        method: "POST",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
        ...init,
      }),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        method: "PUT",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
        ...init,
      }),
    patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        method: "PATCH",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
        ...init,
      }),
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { method: "DELETE", ...init }),
  };
}

export const apiClient = createApiClient({
  baseUrl: appEnv.apiUrl,
  getOrganizationId: () => {
    const { useOrganizationStore } = require("@/store/modules/organization");
    return useOrganizationStore.getState().activeOrganizationId;
  },
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
