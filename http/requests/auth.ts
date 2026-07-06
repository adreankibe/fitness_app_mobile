import { apiClient } from "@/http/client";
import type { CompleteProfileRequest, CurrentUser } from "@/types/api";

const BASE = "/v1/auth";

export const authApi = {
  me: () => apiClient.get<CurrentUser>(`${BASE}/me`),
  completeProfile: (input: CompleteProfileRequest) =>
    apiClient.patch<CurrentUser>(`${BASE}/profile`, input),
  refreshRegistration: () =>
    apiClient.post<CurrentUser>(`${BASE}/registration/refresh`),
  setDefaultOrganization: (organizationId: string) =>
    apiClient.put<{ defaultOrganizationId: string }>(
      `${BASE}/default-organization`,
      { organizationId },
    ),
};
