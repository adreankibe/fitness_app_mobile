import {
  ApiError,
  buildApiUrl,
  createApiClient,
  createAuthHeaders,
  createOrganizationHeaders,
} from "@/http/client";

describe("buildApiUrl", () => {
  it("joins base URL and API path without duplicate slashes", () => {
    expect(buildApiUrl("http://localhost:3000/", "/v1/health")).toBe(
      "http://localhost:3000/v1/health",
    );
  });
});

describe("createAuthHeaders", () => {
  it("adds bearer token only when token exists", () => {
    expect(createAuthHeaders("token-123")).toEqual({
      Authorization: "Bearer token-123",
    });
    expect(createAuthHeaders(null)).toEqual({});
  });
});

describe("createOrganizationHeaders", () => {
  it("adds organization context only when present", () => {
    expect(createOrganizationHeaders("org-123")).toEqual({
      "x-organization-id": "org-123",
    });
    expect(createOrganizationHeaders(null)).toEqual({});
  });
});

describe("createApiClient", () => {
  it("attaches Supabase access token to backend requests", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ ok: true }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      getAccessToken: async () => "access-token",
      fetchFn,
    });

    await expect(client.get("/v1/health")).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledWith(
      "http://localhost:3000/v1/health",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      }),
    );
  });

  it("attaches active organization id to backend requests", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      fetchFn,
      getAccessToken: async () => null,
      getOrganizationId: () => "org-456",
    });

    await client.get("/v1/members");

    expect(fetchFn).toHaveBeenCalledWith(
      "http://localhost:3000/v1/members",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-organization-id": "org-456",
        }),
      }),
    );
  });

  it("throws ApiError with status and response body message", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: { get: () => "application/json" },
      json: async () => ({ message: "Unauthorized" }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      getAccessToken: async () => null,
      fetchFn,
    });

    await expect(client.get("/v1/auth/me")).rejects.toEqual(
      new ApiError("Unauthorized", 401),
    );
  });

  it("runs the unauthorized handler for expired sessions", async () => {
    const onUnauthorized = jest.fn();
    const fetchFn = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Session expired" }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      fetchFn,
      getAccessToken: async () => "expired-token",
      onUnauthorized,
    });

    await expect(client.get("/v1/members")).rejects.toEqual(
      new ApiError("Session expired", 401),
    );
    expect(onUnauthorized).toHaveBeenCalledWith(
      new ApiError("Session expired", 401),
    );
  });

  it("runs the forbidden handler for permission errors", async () => {
    const onForbidden = jest.fn();
    const fetchFn = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: "Forbidden" }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      fetchFn,
      getAccessToken: async () => "access-token",
      onForbidden,
    });

    await expect(client.get("/v1/org/settings")).rejects.toEqual(
      new ApiError("Forbidden", 403),
    );
    expect(onForbidden).toHaveBeenCalledWith(new ApiError("Forbidden", 403));
  });

  it("converts network failures into ApiError and runs the network handler", async () => {
    const onNetworkError = jest.fn();
    const fetchFn = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      fetchFn,
      getAccessToken: async () => null,
      onNetworkError,
    });

    await expect(client.get("/v1/health")).rejects.toEqual(
      new ApiError("Network error. Check your connection.", 0),
    );
    expect(onNetworkError).toHaveBeenCalledWith(
      new ApiError("Network error. Check your connection.", 0),
    );
  });
});
