import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import { organizationsService } from "@/services/organizations";
import { useOrganizationStore } from "@/store/modules/organization";

export function useOrganizations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: organizationsService.list,
    enabled,
  });
}

export function useCurrentOrganization(enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.currentOrganization(organizationId),
    queryFn: organizationsService.current,
    enabled: enabled && Boolean(organizationId),
  });
}
