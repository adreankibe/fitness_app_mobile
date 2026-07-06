import React from "react";

import { useOrganizationStore } from "@/store/modules/organization";
import { useInvitationsStore } from "@/store/modules/invitations";
import type { InvitationFilters } from "@/types";

export function useInvitations(
  filters: InvitationFilters = {},
  enabled = true,
) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useInvitationsStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchInvitations(filters);
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.invitations ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: () => store.fetchInvitations(filters),
  };
}

export function useInvitationPreview(token: string | undefined) {
  const store = useInvitationsStore();

  React.useEffect(() => {
    if (token) {
      void store.fetchInvitationPreview(token);
    }
  }, [token]);

  return {
    data: token ? store.previews[token] : undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: async () => {
      if (token) {
        await store.fetchInvitationPreview(token);
      }
    },
  };
}
