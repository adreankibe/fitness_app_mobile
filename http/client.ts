import { appEnv } from "@/constants/env";
import { supabase } from "@/lib/supabase/client";

type FetchLike = typeof fetch;

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
  fetchFn?: FetchLike;
};

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

    const response = await fetchFn(buildApiUrl(baseUrl, path), {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw new ApiError(await readErrorMessage(response), response.status);
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
