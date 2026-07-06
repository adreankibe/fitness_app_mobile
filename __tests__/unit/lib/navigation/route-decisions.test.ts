import { resolveInitialRoute } from "@/lib/navigation/route-decisions";
import type { CurrentUser } from "@/types/api";

function user(nextAction: CurrentUser["nextAction"]): CurrentUser {
  return {
    acceptedTermsAt: null,
    activeOrganizationId: null,
    avatarUrl: null,
    defaultOrganizationId: null,
    email: "coach@example.com",
    fullName: "Coach",
    id: "user-1",
    memberships: [],
    nextAction,
    registrationStatus: "ACTIVE",
  };
}

describe("resolveInitialRoute", () => {
  it("waits while auth or user state is loading", () => {
    expect(resolveInitialRoute(true, false, null)).toBeNull();
  });

  it("sends guests to login", () => {
    expect(resolveInitialRoute(false, false, null)).toBe("/(auth)/login");
  });

  it("routes profile-incomplete users to profile onboarding", () => {
    expect(resolveInitialRoute(false, true, user("COMPLETE_PROFILE"))).toBe(
      "/(auth)/onboarding/profile",
    );
  });

  it("routes active users to dashboard", () => {
    expect(resolveInitialRoute(false, true, user("CONTINUE"))).toBe(
      "/(app)/dashboard",
    );
  });
});
