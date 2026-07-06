import { apiClient } from "@/http/client";
import type { ItemsResponse } from "@/types";
import type { WorkoutLog } from "@/lib/training/catalog";

export type WorkoutListResponse = WorkoutLog[] | ItemsResponse<WorkoutLog>;

export const workoutsService = {
  list: () => apiClient.get<WorkoutListResponse>("/v1/athletes"),
};
