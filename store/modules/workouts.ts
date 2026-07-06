import { create } from "zustand";

import { workoutsApi } from "@/http/requests/workouts";
import {
  filterWorkouts,
  findWorkout,
  resolveWorkoutCollection,
  type WorkoutFilters,
  type WorkoutLog,
} from "@/lib/training/catalog";
import { errorMessage } from "@/store/modules/shared";

export type WorkoutsStoreState = {
  workouts: WorkoutLog[];
  isLoading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<WorkoutLog[]>;
  selectWorkouts: (filters?: WorkoutFilters) => WorkoutLog[];
  selectWorkout: (workoutId: string | undefined) => WorkoutLog | null;
  clearError: () => void;
  resetStore: () => void;
};

export const useWorkoutsStore = create<WorkoutsStoreState>()((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,
  fetchWorkouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutsApi.list();
      const workouts = resolveWorkoutCollection(response);
      set({ workouts, isLoading: false });
      return workouts;
    } catch (error) {
      const message = errorMessage(error, "Failed to load workouts");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  selectWorkouts: (filters = {}) => filterWorkouts(get().workouts, filters),
  selectWorkout: (workoutId) => findWorkout(get().workouts, workoutId),
  clearError: () => set({ error: null }),
  resetStore: () => set({ workouts: [], isLoading: false, error: null }),
}));
