import {
  ApiError,
  buildApiUrl,
  createApiClient,
  createAuthHeaders,
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
});
