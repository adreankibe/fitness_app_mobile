import { getActiveMembership, hasAnyPermission, hasPermission } from "@/lib/permissions/access";
import type { CurrentUserMembership } from "@/types/api";

describe("permission helpers", () => {
  it("checks exact and any permissions", () => {
    expect(hasPermission(["members:list"], "members:list")).toBe(true);
    expect(hasAnyPermission(["members:list"], ["audit:list", "members:list"])).toBe(true);
    expect(hasAnyPermission(["members:list"], ["audit:list"])).toBe(false);
  });

  it("finds active membership by organization id", () => {
    const memberships: CurrentUserMembership[] = [
      {
        id: "mem-1",
        organizationId: "org-1",
        organizationName: "A",
        organizationSlug: "a",
        permissions: [],
        role: "OWNER",
        status: "ACTIVE",
      },
    ];

    expect(getActiveMembership(memberships, "org-1")?.id).toBe("mem-1");
    expect(getActiveMembership(memberships, "missing")).toBeNull();
  });
});
