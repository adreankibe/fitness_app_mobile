import React from "react";

import { type WorkoutFilters } from "@/lib/training/catalog";
import { useOrganizationStore } from "@/store/modules/organization";
import { useWorkoutsStore } from "@/store/modules/workouts";

export function useWorkouts(filters: WorkoutFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useWorkoutsStore();
  const filterKey = JSON.stringify(filters);

  React.useEffect(() => {
    if (enabled && organizationId) {
      void store.fetchWorkouts();
    }
  }, [enabled, organizationId, filterKey]);

  return {
    data: store.selectWorkouts(filters),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchWorkouts,
  };
}

export function useWorkout(workoutId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const store = useWorkoutsStore();

  React.useEffect(() => {
    if (enabled && organizationId && workoutId) {
      void store.fetchWorkouts();
    }
  }, [enabled, organizationId, workoutId]);

  return {
    data: store.selectWorkout(workoutId),
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchWorkouts,
  };
}
