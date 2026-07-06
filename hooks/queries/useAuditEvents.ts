import { useQuery } from "@tanstack/react-query";

import { auditEventsService, type AuditFilters } from "@/services/audit-events";
import { queryKeys } from "@/hooks/queries/keys";
import { useOrganizationStore } from "@/store/modules/organization";

export function useAuditEvents(filters: AuditFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.auditEvents(organizationId, filters),
    queryFn: () => auditEventsService.list(filters),
    enabled: enabled && Boolean(organizationId),
  });
}
