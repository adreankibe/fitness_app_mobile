import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import {
  filterWorkouts,
  findWorkout,
  resolveWorkoutCollection,
  type WorkoutFilters,
} from "@/lib/training/catalog";
import { workoutsService } from "@/services/workouts";
import { useOrganizationStore } from "@/store/modules/organization";

export function useWorkouts(filters: WorkoutFilters = {}, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.workouts(organizationId, filters),
    queryFn: workoutsService.list,
    select: (data) => filterWorkouts(resolveWorkoutCollection(data), filters),
    enabled: enabled && Boolean(organizationId),
  });
}

export function useWorkout(workoutId: string | undefined, enabled = true) {
  const organizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );

  return useQuery({
    queryKey: queryKeys.workout(organizationId, workoutId),
    queryFn: workoutsService.list,
    select: (data) => findWorkout(resolveWorkoutCollection(data), workoutId),
    enabled: enabled && Boolean(organizationId && workoutId),
  });
}
