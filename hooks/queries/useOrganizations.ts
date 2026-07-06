import React from "react";

import { useOrganizationStore } from "@/store/modules/organization";
import { useOrganizationsStore } from "@/store/modules/organizations";

export function useOrganizations(enabled = true) {
  const store = useOrganizationsStore();

  React.useEffect(() => {
    if (enabled) {
      void store.fetchOrganizations();
    }
  }, [enabled]);

  return {
    data: { items: store.organizations },
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchOrganizations,
  };
}

export function useCurrentOrganization(enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useOrganizationsStore();

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchCurrentOrganization();
    }
  }, [enabled, organizationId]);

  return {
    data: store.currentOrganization ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchCurrentOrganization,
  };
}
