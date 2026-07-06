import { createSupabaseStorage } from "@/lib/supabase/client";

describe("createSupabaseStorage", () => {
  it("uses localStorage on web instead of Expo SecureStore", async () => {
    const storage = createSupabaseStorage("web");

    await storage.setItem("session", "token");

    expect(await storage.getItem("session")).toBe("token");

    await storage.removeItem("session");

    expect(await storage.getItem("session")).toBeNull();
  });
});
