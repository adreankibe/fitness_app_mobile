import { apiClient } from "@/http/client";
import { pathSegment, toQuery } from "@/http/requests/query";
import type { ItemsResponse, TeamFilters } from "@/types";
import type {
  CreateTeamRequest,
  TeamDetail,
  TeamSummary,
  UpdateTeamRequest,
} from "@/types/api";

const BASE = "/v1/teams";

export const teamsApi = {
  list: (filters: TeamFilters = {}) =>
    apiClient.get<ItemsResponse<TeamSummary>>(`${BASE}${toQuery(filters)}`),
  get: (teamId: string) => apiClient.get<TeamDetail>(`${BASE}/${pathSegment(teamId)}`),
  create: (input: CreateTeamRequest) =>
    apiClient.post<TeamDetail>(BASE, input),
  update: (teamId: string, input: UpdateTeamRequest) =>
    apiClient.patch<TeamDetail>(`${BASE}/${pathSegment(teamId)}`, input),
  archive: (teamId: string) =>
    apiClient.post<TeamDetail>(`${BASE}/${pathSegment(teamId)}/archive`),
};
