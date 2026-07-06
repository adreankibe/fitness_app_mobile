import { useOrganizationStore } from "@/store/modules/organization";
import type { CurrentUserMembership, Organization } from "@/types/api";

const memberships: CurrentUserMembership[] = [
  {
    id: "membership-1",
    organizationId: "org-1",
    organizationName: "Forge Strength",
    organizationSlug: "forge-strength",
    role: "OWNER",
    status: "ACTIVE",
    permissions: ["members:read", "members:invite"],
  },
  {
    id: "membership-2",
    organizationId: "org-2",
    organizationName: "Platform Barbell",
    organizationSlug: "platform-barbell",
    role: "COACH",
    status: "ACTIVE",
    permissions: ["programs:read"],
  },
];

const organizations: Organization[] = [
  {
    id: "org-1",
    name: "Forge Strength",
    slug: "forge-strength",
    status: "ACTIVE",
    role: "OWNER",
    membershipStatus: "ACTIVE",
    memberCount: 14,
  },
  {
    id: "org-2",
    name: "Platform Barbell",
    slug: "platform-barbell",
    status: "ACTIVE",
    role: "COACH",
    membershipStatus: "ACTIVE",
    memberCount: 8,
  },
];

describe("useOrganizationStore", () => {
  beforeEach(() => {
    useOrganizationStore.getState().reset();
  });

  it("keeps the active organization, organization list, memberships, and permissions together", () => {
    useOrganizationStore
      .getState()
      .hydrateFromMemberships(memberships, "org-2");
    useOrganizationStore.getState().setOrganizations(organizations);

    expect(useOrganizationStore.getState()).toMatchObject({
      activeOrganizationId: "org-2",
      organizations,
      memberships,
      permissions: ["programs:read"],
    });
  });

  it("updates permissions when active organization changes", () => {
    useOrganizationStore.getState().hydrateFromMemberships(memberships);

    useOrganizationStore.getState().setActiveOrganization("org-2");

    expect(useOrganizationStore.getState().activeOrganizationId).toBe("org-2");
    expect(useOrganizationStore.getState().permissions).toEqual([
      "programs:read",
    ]);
  });
});
