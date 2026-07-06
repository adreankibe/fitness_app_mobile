import React from "react";

import { useMembersStore } from "@/store/modules/members";
import { useOrganizationStore } from "@/store/modules/organization";
import type { MemberFilters } from "@/types";

export function useMembers(filters: MemberFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useMembersStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchMembers(filters);
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.members ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: () => store.fetchMembers(filters),
  };
}

export function useMember(membershipId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useMembersStore();

  React.useEffect(() => {
    if (enabled && organizationId && membershipId) {
      void store.fetchMember(membershipId);
    }
  }, [enabled, organizationId, membershipId]);

  return {
    data: membershipId ? store.memberDetails[membershipId] : undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: async () => {
      if (membershipId) {
        await store.fetchMember(membershipId);
      }
    },
  };
}
