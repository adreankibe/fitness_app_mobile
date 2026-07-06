import { apiClient } from "@/http/client";
import type { CompleteProfileRequest, CurrentUser } from "@/types/api";

export const authService = {
  me: () => apiClient.get<CurrentUser>("/v1/auth/me"),
  completeProfile: (input: CompleteProfileRequest) =>
    apiClient.patch<CurrentUser>("/v1/auth/profile", input),
  refreshRegistration: () =>
    apiClient.post<CurrentUser>("/v1/auth/registration/refresh"),
  setDefaultOrganization: (organizationId: string) =>
    apiClient.put<{ defaultOrganizationId: string }>(
      "/v1/auth/default-organization",
      { organizationId },
    ),
};
