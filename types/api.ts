export type OrganizationRole =
  | "OWNER"
  | "COACH"
  | "ASSISTANT_COACH"
  | "ATHLETE"
  | "TRIAL_USER"
  | "APPLICANT";

export type TeamRole = "TEAM_COACH" | "TEAM_ASSISTANT" | "TEAM_ATHLETE";

export type RegistrationNextAction =
  | "COMPLETE_PROFILE"
  | "CREATE_OR_JOIN_ORGANIZATION"
  | "SELECT_ORGANIZATION"
  | "CONTINUE"
  | "CONTACT_SUPPORT";

export type CurrentUserMembership = {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: OrganizationRole | string;
  status: string;
  permissions: string[];
};

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  acceptedTermsAt: string | null;
  registrationStatus: string;
  defaultOrganizationId: string | null;
  activeOrganizationId: string | null;
  nextAction: RegistrationNextAction;
  memberships: CurrentUserMembership[];
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  status: string;
  role: OrganizationRole | string;
  membershipStatus: string;
  memberCount: number;
};

export type CurrentOrganization = {
  id: string;
  name: string;
  slug: string;
  status: string;
  settings: {
    timezone: string;
    defaultInviteRole: OrganizationRole | string;
    allowAthleteSelfJoin: boolean;
    requireCoachApprovalForBuyers: boolean;
  };
  counts: {
    activeMembers: number;
    pendingInvites: number;
    teams: number;
  };
};

export type UserProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

export type MemberSummary = {
  membershipId: string;
  profileId: string;
  email: string | null;
  fullName: string | null;
  role: OrganizationRole | string;
  status: string;
  teamIds: string[];
  joinedAt: string;
};

export type MemberDetail = {
  membershipId: string;
  profile: {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  };
  role: OrganizationRole | string;
  status: string;
  teams: Array<{ id: string; name: string }>;
  assignedCoachMembershipIds: string[];
  joinedAt: string;
};

export type Paginated<T> = {
  items: T[];
  page?: number;
  pageSize?: number;
  total?: number;
};

export type TeamSummary = {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: string;
  memberCount: number;
  coachCount: number;
  createdAt: string;
};

export type TeamMember = {
  teamMembershipId: string;
  membershipId: string;
  fullName: string | null;
  email: string | null;
  organizationRole: OrganizationRole | string;
  teamRole: TeamRole | string;
};

export type TeamDetail = TeamSummary & {
  members: TeamMember[];
};

export type Invitation = {
  id: string;
  email: string | null;
  role: OrganizationRole | string;
  teamId: string | null;
  status: string;
  expiresAt: string;
  createdAt: string;
};

export type InvitationPreview = {
  organizationName: string;
  organizationSlug: string;
  role: OrganizationRole | string;
  teamName: string | null;
  emailHint: string | null;
  status: string;
  expiresAt: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  actorMembershipId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type CompleteProfileRequest = {
  fullName: string;
  avatarUrl?: string | null;
  acceptTerms: boolean;
};

export type CreateOrganizationRequest = {
  name: string;
  slug: string;
  timezone: string;
};

export type UpdateOrganizationRequest = Partial<{
  name: string;
  slug: string;
}>;

export type UpdateOrganizationSettingsRequest = Partial<{
  timezone: string;
  defaultInviteRole: OrganizationRole;
  allowAthleteSelfJoin: boolean;
  requireCoachApprovalForBuyers: boolean;
}>;

export type CreateInvitationRequest = {
  email?: string;
  role: OrganizationRole;
  teamId?: string;
  expiresInDays?: number;
  maxRedemptions?: number;
  message?: string;
};

export type CreateTeamRequest = {
  name: string;
  description?: string;
};

export type UpdateTeamRequest = Partial<{
  name: string;
  description: string | null;
}>;

export type UpdateUserProfileRequest = Partial<{
  fullName: string;
  avatarUrl: string | null;
}>;
