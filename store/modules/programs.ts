import { create } from "zustand";

import { programsApi } from "@/http/requests/programs";
import {
  filterPrograms,
  findProgram,
  findSession,
  resolveProgramCollection,
  type ProgramFilters,
  type ProgramSession,
  type ProgramTemplate,
} from "@/lib/training/catalog";
import { errorMessage } from "@/store/modules/shared";

export type ProgramsStoreState = {
  programs: ProgramTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchPrograms: () => Promise<ProgramTemplate[]>;
  selectPrograms: (filters?: ProgramFilters) => ProgramTemplate[];
  selectProgram: (programId: string | undefined) => ProgramTemplate | null;
  selectProgramSession: (
    programId: string | undefined,
    sessionId: string | undefined,
  ) => ProgramSession | null;
  clearError: () => void;
  resetStore: () => void;
};

export const useProgramsStore = create<ProgramsStoreState>()((set, get) => ({
  programs: [],
  isLoading: false,
  error: null,
  fetchPrograms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await programsApi.list();
      const programs = resolveProgramCollection(response);
      set({ programs, isLoading: false });
      return programs;
    } catch (error) {
      const message = errorMessage(error, "Failed to load programs");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  selectPrograms: (filters = {}) => filterPrograms(get().programs, filters),
  selectProgram: (programId) => findProgram(get().programs, programId),
  selectProgramSession: (programId, sessionId) =>
    findSession(get().programs, programId, sessionId),
  clearError: () => set({ error: null }),
  resetStore: () => set({ programs: [], isLoading: false, error: null }),
}));
