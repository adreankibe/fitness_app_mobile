import { queryKeys } from "@/hooks/queries/keys";

describe("queryKeys", () => {
  it("matches the Phase 4 backend cache contract", () => {
    const filters = { status: "ACTIVE" };

    expect(queryKeys.health).toEqual(["health"]);
    expect(queryKeys.session).toEqual(["session"]);
    expect(queryKeys.authMe).toBe(queryKeys.session);
    expect(queryKeys.organizations).toEqual(["organizations"]);
    expect(queryKeys.currentOrganization("org-1")).toEqual([
      "organization",
      "org-1",
    ]);
    expect(queryKeys.members("org-1", filters)).toEqual([
      "members",
      "org-1",
      filters,
    ]);
    expect(queryKeys.member("org-1", "membership-1")).toEqual([
      "member",
      "org-1",
      "membership-1",
    ]);
    expect(queryKeys.teams("org-1", filters)).toEqual([
      "teams",
      "org-1",
      filters,
    ]);
    expect(queryKeys.team("org-1", "team-1")).toEqual([
      "team",
      "org-1",
      "team-1",
    ]);
    expect(queryKeys.programs("org-1")).toEqual(["programs", "org-1"]);
    expect(queryKeys.program("org-1", "program-1")).toEqual([
      "program",
      "org-1",
      "program-1",
    ]);
    expect(queryKeys.invitations("org-1", filters)).toEqual([
      "invitations",
      "org-1",
      filters,
    ]);
    expect(queryKeys.invitationPreview("invite-token")).toEqual([
      "invitation",
      "invite-token",
    ]);
    expect(queryKeys.auditEvents("org-1", filters)).toEqual([
      "audit-events",
      "org-1",
      filters,
    ]);
  });
});
