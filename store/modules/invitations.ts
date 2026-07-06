import { create } from "zustand";

import { invitationsApi } from "@/http/requests/invitations";
import { errorMessage } from "@/store/modules/shared";
import type { InvitationFilters, ItemsResponse } from "@/types";
import type { CreateInvitationRequest, Invitation, InvitationPreview } from "@/types/api";

export type InvitationsStoreState = {
  invitations: ItemsResponse<Invitation> | null;
  previews: Record<string, InvitationPreview>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchInvitations: (filters?: InvitationFilters) => Promise<ItemsResponse<Invitation>>;
  fetchInvitationPreview: (token: string) => Promise<InvitationPreview>;
  createInvitation: (input: CreateInvitationRequest) => Promise<Invitation>;
  acceptInvitation: (token: string, acceptEmailMismatch?: boolean) => Promise<Invitation>;
  resendInvitation: (invitationId: string) => Promise<Invitation>;
  revokeInvitation: (invitationId: string) => Promise<Invitation>;
  clearError: () => void;
  resetStore: () => void;
};

export const useInvitationsStore = create<InvitationsStoreState>()((set) => ({
  invitations: null,
  previews: {},
  isLoading: false,
  isSaving: false,
  error: null,
  fetchInvitations: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const invitations = await invitationsApi.list(filters);
      set({ invitations, isLoading: false });
      return invitations;
    } catch (error) {
      const message = errorMessage(error, "Failed to load invitations");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  fetchInvitationPreview: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const preview = await invitationsApi.preview(token);
      set((state) => ({
        previews: { ...state.previews, [token]: preview },
        isLoading: false,
      }));
      return preview;
    } catch (error) {
      const message = errorMessage(error, "Failed to load invite");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  createInvitation: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const invitation = await invitationsApi.create(input);
      set({ isSaving: false });
      return invitation;
    } catch (error) {
      const message = errorMessage(error, "Failed to create invitation");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  acceptInvitation: async (token, acceptEmailMismatch = false) => {
    set({ isSaving: true, error: null });
    try {
      const invitation = await invitationsApi.accept(token, acceptEmailMismatch);
      set({ isSaving: false });
      return invitation;
    } catch (error) {
      const message = errorMessage(error, "Failed to accept invitation");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  resendInvitation: async (invitationId) => {
    set({ isSaving: true, error: null });
    try {
      const invitation = await invitationsApi.resend(invitationId);
      set({ isSaving: false });
      return invitation;
    } catch (error) {
      const message = errorMessage(error, "Failed to resend invitation");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  revokeInvitation: async (invitationId) => {
    set({ isSaving: true, error: null });
    try {
      const invitation = await invitationsApi.revoke(invitationId);
      set({ isSaving: false });
      return invitation;
    } catch (error) {
      const message = errorMessage(error, "Failed to revoke invitation");
      set({ error: message, isSaving: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () =>
    set({
      invitations: null,
      previews: {},
      isLoading: false,
      isSaving: false,
      error: null,
    }),
}));
