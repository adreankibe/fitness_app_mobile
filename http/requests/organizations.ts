import { apiClient } from "@/http/client";
import type { ItemsResponse } from "@/types";
import type {
  CreateOrganizationRequest,
  CurrentOrganization,
  Organization,
  UpdateOrganizationRequest,
  UpdateOrganizationSettingsRequest,
} from "@/types/api";

const BASE = "/v1/organizations";

export const organizationsApi = {
  list: () => apiClient.get<ItemsResponse<Organization>>(BASE),
  current: () => apiClient.get<CurrentOrganization>(`${BASE}/current`),
  create: (input: CreateOrganizationRequest) =>
    apiClient.post<CurrentOrganization>(BASE, input),
  update: (input: UpdateOrganizationRequest) =>
    apiClient.patch<CurrentOrganization>(`${BASE}/current`, input),
  updateSettings: (input: UpdateOrganizationSettingsRequest) =>
    apiClient.patch<CurrentOrganization>(`${BASE}/current/settings`, input),
  archive: () => apiClient.post<{ accepted: true }>(`${BASE}/current/archive`),
};
