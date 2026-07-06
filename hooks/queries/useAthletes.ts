import React from "react";

import { useOrganizationStore } from "@/store/modules/organization";
import { useAthletesStore } from "@/store/modules/athletes";

export function useAthletes(enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useAthletesStore();

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchAthletes();
    }
  }, [enabled, organizationId]);

  return {
    data: store.athletes,
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchAthletes,
  };
}

export function useAthlete(athleteId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useAthletesStore();

  React.useEffect(() => {
    if (enabled && organizationId && athleteId) {
      void store.fetchAthletes();
    }
  }, [enabled, organizationId, athleteId]);

  return {
    data: store.selectAthlete(athleteId),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchAthletes,
  };
}

export function useAthleteWorkoutLog(
  athleteId: string | undefined,
  logId: string | undefined,
  enabled = true,
) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useAthletesStore();

  React.useEffect(() => {
    if (enabled && organizationId && athleteId && logId) {
      void store.fetchAthletes();
    }
  }, [enabled, organizationId, athleteId, logId]);

  return {
    data: store.selectAthleteWorkoutLog(athleteId, logId),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchAthletes,
  };
}
