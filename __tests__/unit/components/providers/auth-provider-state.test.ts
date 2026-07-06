import { createAuthDataSnapshot } from "@/components/providers/auth-provider";
import type { CurrentUser } from "@/types/api";

const currentUser: CurrentUser = {
  acceptedTermsAt: "2026-07-01T00:00:00.000Z",
  activeOrganizationId: "org-1",
  avatarUrl: null,
  defaultOrganizationId: "org-1",
  email: "coach@example.com",
  fullName: "Coach One",
  id: "user-1",
  memberships: [
    {
      id: "membership-1",
      organizationId: "org-1",
      organizationName: "Forge Strength",
      organizationSlug: "forge-strength",
      role: "OWNER",
      status: "ACTIVE",
      permissions: ["members:read", "members:invite"],
    },
  ],
  nextAction: "CONTINUE",
  registrationStatus: "ACTIVE",
};

describe("createAuthDataSnapshot", () => {
  it("exposes registration state, next action, memberships, and permissions from the current user", () => {
    expect(
      createAuthDataSnapshot(currentUser, ["members:read", "members:invite"]),
    ).toEqual({
      currentUser,
      memberships: currentUser.memberships,
      nextAction: "CONTINUE",
      permissions: ["members:read", "members:invite"],
      registrationStatus: "ACTIVE",
    });
  });

  it("uses safe empty values before the backend session profile loads", () => {
    expect(createAuthDataSnapshot(null, [])).toEqual({
      currentUser: null,
      memberships: [],
      nextAction: null,
      permissions: [],
      registrationStatus: null,
    });
  });
});
