import { create } from "zustand";

import { membersApi } from "@/http/requests/members";
import { errorMessage } from "@/store/modules/shared";
import type { MemberFilters, PagedItemsResponse } from "@/types";
import type { MemberDetail, MemberSummary } from "@/types/api";

export type MembersStoreState = {
  members: PagedItemsResponse<MemberSummary> | null;
  memberDetails: Record<string, MemberDetail>;
  isLoading: boolean;
  error: string | null;
  fetchMembers: (filters?: MemberFilters) => Promise<PagedItemsResponse<MemberSummary>>;
  fetchMember: (membershipId: string) => Promise<MemberDetail>;
  clearError: () => void;
  resetStore: () => void;
};

export const useMembersStore = create<MembersStoreState>()((set) => ({
  members: null,
  memberDetails: {},
  isLoading: false,
  error: null,
  fetchMembers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const members = await membersApi.list(filters);
      set({ members, isLoading: false });
      return members;
    } catch (error) {
      const message = errorMessage(error, "Failed to load members");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  fetchMember: async (membershipId) => {
    set({ isLoading: true, error: null });
    try {
      const member = await membersApi.get(membershipId);
      set((state) => ({
        memberDetails: { ...state.memberDetails, [membershipId]: member },
        isLoading: false,
      }));
      return member;
    } catch (error) {
      const message = errorMessage(error, "Failed to load member");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ members: null, memberDetails: {}, isLoading: false, error: null }),
}));
