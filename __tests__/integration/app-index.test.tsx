import { resolveInitialRoute } from "@/lib/navigation/route-decisions";

describe("app index routing smoke", () => {
  it("routes unauthenticated launches into auth", () => {
    expect(resolveInitialRoute(false, false, null)).toBe("/(auth)/login");
  });
});
