import React from "react";

import { useAuditEventsStore } from "@/store/modules/audit-events";
import { useOrganizationStore } from "@/store/modules/organization";
import type { AuditFilters } from "@/types";

export function useAuditEvents(filters: AuditFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useAuditEventsStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchAuditEvents(filters);
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.auditEvents ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: () => store.fetchAuditEvents(filters),
  };
}
