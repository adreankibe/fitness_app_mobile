import React from "react";

import {
  type ProgramFilters,
} from "@/lib/training/catalog";
import { useOrganizationStore } from "@/store/modules/organization";
import { useProgramsStore } from "@/store/modules/programs";

export function usePrograms(filters: ProgramFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useProgramsStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchPrograms();
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.selectPrograms(filters),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchPrograms,
  };
}

export function useProgram(programId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useProgramsStore();

  React.useEffect(() => {
    if (enabled && organizationId && programId) {
      void store.fetchPrograms();
    }
  }, [enabled, organizationId, programId]);

  return {
    data: store.selectProgram(programId),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchPrograms,
  };
}

export function useProgramSession(
  programId: string | undefined,
  sessionId: string | undefined,
  enabled = true,
) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useProgramsStore();

  React.useEffect(() => {
    if (enabled && organizationId && programId && sessionId) {
      void store.fetchPrograms();
    }
  }, [enabled, organizationId, programId, sessionId]);

  return {
    data: store.selectProgramSession(programId, sessionId),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchPrograms,
  };
}
