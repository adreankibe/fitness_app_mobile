import { createEnv } from "@/constants/env";

describe("createEnv", () => {
  it("normalizes public URLs without trailing slashes", () => {
    const env = createEnv({
      EXPO_PUBLIC_API_URL: "http://localhost:3000/",
      EXPO_PUBLIC_SUPABASE_URL: "https://example.supabase.co/",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });

    expect(env.apiUrl).toBe("http://localhost:3000");
    expect(env.supabaseUrl).toBe("https://example.supabase.co");
    expect(env.supabaseAnonKey).toBe("anon-key");
  });

  it("reports missing public env values with the variable name", () => {
    expect(() => createEnv({})).toThrow("EXPO_PUBLIC_API_URL");
  });
});
