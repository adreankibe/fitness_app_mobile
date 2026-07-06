export const queryKeys = {
  authMe: ["auth", "me"] as const,
  organizations: ["organizations"] as const,
  currentOrganization: (organizationId: string | null) =>
    ["organizations", "current", organizationId] as const,
  members: (organizationId: string | null, filters: unknown) =>
    ["members", organizationId, filters] as const,
  member: (organizationId: string | null, membershipId: string | undefined) =>
    ["members", organizationId, membershipId] as const,
  teams: (organizationId: string | null, filters: unknown) =>
    ["teams", organizationId, filters] as const,
  team: (organizationId: string | null, teamId: string | undefined) =>
    ["teams", organizationId, teamId] as const,
  invitations: (organizationId: string | null, filters: unknown) =>
    ["invitations", organizationId, filters] as const,
  invitationPreview: (token: string | undefined) =>
    ["invitations", "preview", token] as const,
  auditEvents: (organizationId: string | null, filters: unknown) =>
    ["audit-events", organizationId, filters] as const,
  userMe: ["users", "me"] as const,
};
