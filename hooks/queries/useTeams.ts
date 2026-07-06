import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import { teamsService, type TeamFilters } from "@/services/teams";
import { useOrganizationStore } from "@/store/modules/organization";

export function useTeams(filters: TeamFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.teams(organizationId, filters),
    queryFn: () => teamsService.list(filters),
    enabled: enabled && Boolean(organizationId),
  });
}

export function useTeam(teamId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.team(organizationId, teamId),
    queryFn: () => teamsService.get(teamId as string),
    enabled: enabled && Boolean(organizationId && teamId),
  });
}
