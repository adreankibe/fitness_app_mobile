import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import {
  invitationsService,
  type InvitationFilters,
} from "@/services/invitations";
import { useOrganizationStore } from "@/store/modules/organization";

export function useInvitations(
  filters: InvitationFilters = {},
  enabled = true,
) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.invitations(organizationId, filters),
    queryFn: () => invitationsService.list(filters),
    enabled: enabled && Boolean(organizationId),
  });
}

export function useInvitationPreview(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invitationPreview(token),
    queryFn: () => invitationsService.preview(token as string),
    enabled: Boolean(token),
  });
}
