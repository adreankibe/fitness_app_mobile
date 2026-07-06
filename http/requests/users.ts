import { apiClient } from "@/http/client";
import type { UpdateUserProfileRequest, UserProfile } from "@/types/api";

const BASE = "/v1/users";

export const usersApi = {
  me: () => apiClient.get<UserProfile>(`${BASE}/me`),
  updateMe: (input: UpdateUserProfileRequest) =>
    apiClient.patch<UserProfile>(`${BASE}/me`, input),
};
