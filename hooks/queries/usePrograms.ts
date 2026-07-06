import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import {
  filterPrograms,
  findProgram,
  findSession,
  resolveProgramCollection,
  type ProgramFilters,
} from "@/lib/training/catalog";
import { programsService } from "@/services/programs";
import { useOrganizationStore } from "@/store/modules/organization";

export function usePrograms(filters: ProgramFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.programs(organizationId, filters),
    queryFn: programsService.list,
    select: (data) => filterPrograms(resolveProgramCollection(data), filters),
    enabled: enabled && Boolean(organizationId),
  });
}

export function useProgram(programId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.program(organizationId, programId),
    queryFn: programsService.list,
    select: (data) => findProgram(resolveProgramCollection(data), programId),
    enabled: enabled && Boolean(organizationId && programId),
  });
}

export function useProgramSession(
  programId: string | undefined,
  sessionId: string | undefined,
  enabled = true,
) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.programSession(organizationId, programId, sessionId),
    queryFn: programsService.list,
    select: (data) =>
      findSession(resolveProgramCollection(data), programId, sessionId),
    enabled: enabled && Boolean(organizationId && programId && sessionId),
  });
}
