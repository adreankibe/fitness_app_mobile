import { create } from "zustand";

import { athletesApi } from "@/http/requests/athletes";
import {
  findAthlete,
  findAthleteWorkoutLog,
  resolveAthleteCollection,
  type AthleteSummary,
  type AthleteWorkoutLog,
} from "@/lib/athletes/catalog";
import { errorMessage } from "@/store/modules/shared";

export type AthletesStoreState = {
  athletes: AthleteSummary[];
  isLoading: boolean;
  error: string | null;
  fetchAthletes: () => Promise<AthleteSummary[]>;
  selectAthlete: (athleteId: string | undefined) => AthleteSummary | null;
  selectAthleteWorkoutLog: (
    athleteId: string | undefined,
    logId: string | undefined,
  ) => AthleteWorkoutLog | null;
  clearError: () => void;
  resetStore: () => void;
};

export const useAthletesStore = create<AthletesStoreState>()((set, get) => ({
  athletes: [],
  isLoading: false,
  error: null,
  fetchAthletes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await athletesApi.list();
      const athletes = resolveAthleteCollection(response);
      set({ athletes, isLoading: false });
      return athletes;
    } catch (error) {
      const message = errorMessage(error, "Failed to load athletes");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  selectAthlete: (athleteId) => findAthlete(get().athletes, athleteId),
  selectAthleteWorkoutLog: (athleteId, logId) =>
    findAthleteWorkoutLog(findAthlete(get().athletes, athleteId), logId),
  clearError: () => set({ error: null }),
  resetStore: () => set({ athletes: [], isLoading: false, error: null }),
}));
