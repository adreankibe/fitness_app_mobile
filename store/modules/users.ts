import { create } from "zustand";

import { usersApi } from "@/http/requests/users";
import { errorMessage } from "@/store/modules/shared";
import type { UpdateUserProfileRequest, UserProfile } from "@/types/api";

export type UsersStoreState = {
  me: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchMe: () => Promise<UserProfile | null>;
  updateMe: (input: UpdateUserProfileRequest) => Promise<UserProfile>;
  clearError: () => void;
  resetStore: () => void;
};

export const useUsersStore = create<UsersStoreState>()((set) => ({
  me: null,
  isLoading: false,
  isSaving: false,
  error: null,
  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const me = await usersApi.me();
      set({ me, isLoading: false });
      return me;
    } catch (error) {
      const message = errorMessage(error, "Failed to load profile");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  updateMe: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const me = await usersApi.updateMe(input);
      set({ me, isSaving: false });
      return me;
    } catch (error) {
      const message = errorMessage(error, "Failed to update profile");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ me: null, isLoading: false, isSaving: false, error: null }),
}));
