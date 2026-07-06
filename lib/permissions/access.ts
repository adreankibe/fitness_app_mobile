import type { CurrentUserMembership } from "@/types/api";

export function hasPermission(
  permissions: string[] | undefined,
  permission: string,
) {
  return Boolean(permissions?.includes(permission));
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  required: string[],
) {
  return required.some((permission) => hasPermission(permissions, permission));
}

export function getActiveMembership(
  memberships: CurrentUserMembership[],
  organizationId: string | null,
) {
  return (
    memberships.find(
      (membership) => membership.organizationId === organizationId,
    ) ?? null
  );
}
