import { apiClient } from "@/http/client";
import { pathSegment } from "@/http/requests/query";
import type { AthleteSummary } from "@/lib/athletes/catalog";
import type { ItemsResponse } from "@/types";

const BASE = "/v1/athletes";

export const athletesApi = {
  list: () => apiClient.get<ItemsResponse<AthleteSummary> | AthleteSummary[]>(BASE),
  get: (athleteId: string) =>
    apiClient.get<AthleteSummary>(`${BASE}/${pathSegment(athleteId)}`),
  workoutLog: (athleteId: string, logId: string) =>
    apiClient.get(
      `${BASE}/${pathSegment(athleteId)}/workout/${pathSegment(logId)}`,
    ),
};
