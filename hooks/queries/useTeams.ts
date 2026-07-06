import React from "react";

import { useOrganizationStore } from "@/store/modules/organization";
import { useTeamsStore } from "@/store/modules/teams";
import type { TeamFilters } from "@/types";

export function useTeams(filters: TeamFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useTeamsStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchTeams(filters);
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.teams ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: () => store.fetchTeams(filters),
  };
}

export function useTeam(teamId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useTeamsStore();

  React.useEffect(() => {
    if (enabled && organizationId && teamId) {
      void store.fetchTeam(teamId);
    }
  }, [enabled, organizationId, teamId]);

  return {
    data: teamId ? store.teamDetails[teamId] : undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: async () => {
      if (teamId) {
        await store.fetchTeam(teamId);
      }
    },
  };
}
