import { apiClient } from "@/http/client";
import type { CreateTeamRequest, TeamDetail, TeamSummary, UpdateTeamRequest } from "@/types/api";
import type { ItemsResponse } from "@/types";

export type TeamFilters = {
  status?: string;
  q?: string;
};

function toQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const teamsService = {
  list: (filters: TeamFilters = {}) =>
    apiClient.get<ItemsResponse<TeamSummary>>(`/v1/teams${toQuery(filters)}`),
  get: (teamId: string) => apiClient.get<TeamDetail>(`/v1/teams/${teamId}`),
  create: (input: CreateTeamRequest) =>
    apiClient.post<TeamDetail>("/v1/teams", input),
  update: (teamId: string, input: UpdateTeamRequest) =>
    apiClient.patch<TeamDetail>(`/v1/teams/${teamId}`, input),
  archive: (teamId: string) =>
    apiClient.post<TeamDetail>(`/v1/teams/${teamId}/archive`),
};
