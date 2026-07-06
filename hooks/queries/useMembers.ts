import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import { membersService, type MemberFilters } from "@/services/members";
import { useOrganizationStore } from "@/store/modules/organization";

export function useMembers(filters: MemberFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.members(organizationId, filters),
    queryFn: () => membersService.list(filters),
    enabled: enabled && Boolean(organizationId),
  });
}

export function useMember(membershipId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.member(organizationId, membershipId),
    queryFn: () => membersService.get(membershipId as string),
    enabled: enabled && Boolean(organizationId && membershipId),
  });
}
