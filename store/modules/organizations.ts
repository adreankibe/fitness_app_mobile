import { create } from "zustand";

import { organizationsApi } from "@/http/requests/organizations";
import { useOrganizationStore } from "@/store/modules/organization";
import { errorMessage } from "@/store/modules/shared";
import type {
  CreateOrganizationRequest,
  CurrentOrganization,
  Organization,
  UpdateOrganizationRequest,
  UpdateOrganizationSettingsRequest,
} from "@/types/api";

export type OrganizationsStoreState = {
  organizations: Organization[];
  currentOrganization: CurrentOrganization | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<Organization[]>;
  fetchCurrentOrganization: () => Promise<CurrentOrganization | null>;
  createOrganization: (input: CreateOrganizationRequest) => Promise<CurrentOrganization>;
  updateOrganization: (input: UpdateOrganizationRequest) => Promise<CurrentOrganization>;
  updateOrganizationSettings: (
    input: UpdateOrganizationSettingsRequest,
  ) => Promise<CurrentOrganization>;
  archiveOrganization: () => Promise<{ accepted: true }>;
  clearError: () => void;
  resetStore: () => void;
};

export const useOrganizationsStore = create<OrganizationsStoreState>()((set) => ({
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  isSaving: false,
  error: null,
  fetchOrganizations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizationsApi.list();
      set({ organizations: response.items, isLoading: false });
      useOrganizationStore.getState().setOrganizations(response.items);
      return response.items;
    } catch (error) {
      const message = errorMessage(error, "Failed to load organizations");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  fetchCurrentOrganization: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentOrganization = await organizationsApi.current();
      set({ currentOrganization, isLoading: false });
      return currentOrganization;
    } catch (error) {
      const message = errorMessage(error, "Failed to load organization");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  createOrganization: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const organization = await organizationsApi.create(input);
      set({ currentOrganization: organization, isSaving: false });
      return organization;
    } catch (error) {
      const message = errorMessage(error, "Failed to create organization");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  updateOrganization: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const organization = await organizationsApi.update(input);
      set({ currentOrganization: organization, isSaving: false });
      return organization;
    } catch (error) {
      const message = errorMessage(error, "Failed to update organization");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  updateOrganizationSettings: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const organization = await organizationsApi.updateSettings(input);
      set({ currentOrganization: organization, isSaving: false });
      return organization;
    } catch (error) {
      const message = errorMessage(error, "Failed to update organization settings");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  archiveOrganization: async () => {
    set({ isSaving: true, error: null });
    try {
      const result = await organizationsApi.archive();
      set({ isSaving: false });
      return result;
    } catch (error) {
      const message = errorMessage(error, "Failed to archive organization");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () =>
    set({
      organizations: [],
      currentOrganization: null,
      isLoading: false,
      isSaving: false,
      error: null,
    }),
}));
