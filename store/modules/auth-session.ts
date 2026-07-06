import { create } from "zustand";

import { authApi } from "@/http/requests/auth";
import { useOrganizationStore } from "@/store/modules/organization";
import { errorMessage } from "@/store/modules/shared";
import type { CompleteProfileRequest, CurrentUser } from "@/types/api";

export type AuthSessionStoreState = {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  fetchAuthMe: () => Promise<CurrentUser | null>;
  completeProfile: (input: CompleteProfileRequest) => Promise<CurrentUser>;
  refreshRegistration: () => Promise<CurrentUser>;
  setDefaultOrganization: (organizationId: string) => Promise<{ defaultOrganizationId: string }>;
  setCurrentUser: (user: CurrentUser | null) => void;
  clearError: () => void;
  resetStore: () => void;
};

function hydrateOrganization(user: CurrentUser | null) {
  if (user) {
    useOrganizationStore
      .getState()
      .hydrateFromMemberships(user.memberships, user.activeOrganizationId);
  } else {
    useOrganizationStore.getState().reset();
  }
}

export const useAuthSessionStore = create<AuthSessionStoreState>()((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  fetchAuthMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.me();
      hydrateOrganization(user);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      const message = errorMessage(error, "Failed to load session");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  completeProfile: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.completeProfile(input);
      hydrateOrganization(user);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      const message = errorMessage(error, "Failed to save profile");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  refreshRegistration: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.refreshRegistration();
      hydrateOrganization(user);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      const message = errorMessage(error, "Failed to refresh registration");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  setDefaultOrganization: async (organizationId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.setDefaultOrganization(organizationId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const message = errorMessage(error, "Failed to set default organization");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  setCurrentUser: (user) => {
    hydrateOrganization(user);
    set({ currentUser: user });
  },
  clearError: () => set({ error: null }),
  resetStore: () => {
    hydrateOrganization(null);
    set({ currentUser: null, isLoading: false, error: null });
  },
}));
