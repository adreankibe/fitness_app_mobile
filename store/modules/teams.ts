import { create } from "zustand";

import { teamsApi } from "@/http/requests/teams";
import { errorMessage } from "@/store/modules/shared";
import type { ItemsResponse, TeamFilters } from "@/types";
import type { CreateTeamRequest, TeamDetail, TeamSummary } from "@/types/api";

export type TeamsStoreState = {
  teams: ItemsResponse<TeamSummary> | null;
  teamDetails: Record<string, TeamDetail>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchTeams: (filters?: TeamFilters) => Promise<ItemsResponse<TeamSummary>>;
  fetchTeam: (teamId: string) => Promise<TeamDetail>;
  createTeam: (input: CreateTeamRequest) => Promise<TeamDetail>;
  clearError: () => void;
  resetStore: () => void;
};

export const useTeamsStore = create<TeamsStoreState>()((set) => ({
  teams: null,
  teamDetails: {},
  isLoading: false,
  isSaving: false,
  error: null,
  fetchTeams: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const teams = await teamsApi.list(filters);
      set({ teams, isLoading: false });
      return teams;
    } catch (error) {
      const message = errorMessage(error, "Failed to load teams");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  fetchTeam: async (teamId) => {
    set({ isLoading: true, error: null });
    try {
      const team = await teamsApi.get(teamId);
      set((state) => ({
        teamDetails: { ...state.teamDetails, [teamId]: team },
        isLoading: false,
      }));
      return team;
    } catch (error) {
      const message = errorMessage(error, "Failed to load team");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  createTeam: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const team = await teamsApi.create(input);
      set((state) => ({
        teamDetails: { ...state.teamDetails, [team.id]: team },
        isSaving: false,
      }));
      return team;
    } catch (error) {
      const message = errorMessage(error, "Failed to create team");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ teams: null, teamDetails: {}, isLoading: false, isSaving: false, error: null }),
}));
