const sessionKey = ["session"] as const;

export const queryKeys = {
  health: ["health"] as const,
  session: sessionKey,
  authMe: sessionKey,
  organizations: ["organizations"] as const,
  currentOrganization: (organizationId: string | null) =>
    ["organization", organizationId] as const,
  currentOrganizationPrefix: ["organization"] as const,
  members: (organizationId: string | null, filters: unknown) =>
    ["members", organizationId, filters] as const,
  member: (organizationId: string | null, membershipId: string | undefined) =>
    ["member", organizationId, membershipId] as const,
  teams: (organizationId: string | null, filters: unknown) =>
    ["teams", organizationId, filters] as const,
  team: (organizationId: string | null, teamId: string | undefined) =>
    ["team", organizationId, teamId] as const,
  invitations: (organizationId: string | null, filters: unknown) =>
    ["invitations", organizationId, filters] as const,
  invitationPreview: (token: string | undefined) =>
    ["invitation", token] as const,
  auditEvents: (organizationId: string | null, filters: unknown) =>
    ["audit-events", organizationId, filters] as const,
  athletes: (organizationId: string | null) => ["athletes", organizationId] as const,
  athlete: (organizationId: string | null, athleteId: string | undefined) =>
    ["athlete", organizationId, athleteId] as const,
  athleteWorkoutLog: (
    organizationId: string | null,
    athleteId: string | undefined,
    logId: string | undefined,
  ) => ["athlete-workout-log", organizationId, athleteId, logId] as const,
  userMe: ["users", "me"] as const,
  programs: (organizationId: string | null, filters?: unknown) =>
    filters === undefined
      ? (["programs", organizationId] as const)
      : (["programs", organizationId, filters] as const),
  program: (organizationId: string | null, programId: string | undefined) =>
    ["program", organizationId, programId] as const,
  programSession: (
    organizationId: string | null,
    programId: string | undefined,
    sessionId: string | undefined,
  ) => ["programs", organizationId, programId, "sessions", sessionId] as const,
  workouts: (organizationId: string | null, filters?: unknown) =>
    filters === undefined
      ? (["workouts", organizationId] as const)
      : (["workouts", organizationId, filters] as const),
  workout: (organizationId: string | null, workoutId: string | undefined) =>
    ["workout", organizationId, workoutId] as const,
};
