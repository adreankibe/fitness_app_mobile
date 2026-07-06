import { apiClient } from "@/http/client";
import type { UpdateUserProfileRequest, UserProfile } from "@/types/api";

export const usersService = {
  me: () => apiClient.get<UserProfile>("/v1/users/me"),
  updateMe: (input: UpdateUserProfileRequest) =>
    apiClient.patch<UserProfile>("/v1/users/me", input),
};
