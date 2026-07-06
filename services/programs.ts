import { apiClient } from "@/http/client";
import type { ItemsResponse } from "@/types";
import type { ProgramTemplate } from "@/lib/training/catalog";

export type ProgramListResponse = ProgramTemplate[] | ItemsResponse<ProgramTemplate>;

export const programsService = {
  list: () => apiClient.get<ProgramListResponse>("/v1/programs"),
};
