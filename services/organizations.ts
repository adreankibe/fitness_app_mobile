import { apiClient } from "@/http/client";
import type {
  CreateOrganizationRequest,
  CurrentOrganization,
  Organization,
  UpdateOrganizationRequest,
  UpdateOrganizationSettingsRequest,
} from "@/types/api";
import type { ItemsResponse } from "@/types";

export const organizationsService = {
  list: () => apiClient.get<ItemsResponse<Organization>>("/v1/organizations"),
  current: () => apiClient.get<CurrentOrganization>("/v1/organizations/current"),
  create: (input: CreateOrganizationRequest) =>
    apiClient.post<CurrentOrganization>("/v1/organizations", input),
  update: (input: UpdateOrganizationRequest) =>
    apiClient.patch<CurrentOrganization>("/v1/organizations/current", input),
  updateSettings: (input: UpdateOrganizationSettingsRequest) =>
    apiClient.patch<CurrentOrganization>(
      "/v1/organizations/current/settings",
      input,
    ),
  archive: () =>
    apiClient.post<{ accepted: true }>("/v1/organizations/current/archive"),
};
