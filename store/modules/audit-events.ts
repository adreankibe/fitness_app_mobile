import { create } from "zustand";

import { auditEventsApi } from "@/http/requests/audit-events";
import { errorMessage } from "@/store/modules/shared";
import type { AuditFilters, PagedItemsResponse } from "@/types";
import type { AuditEvent } from "@/types/api";

export type AuditEventsStoreState = {
  auditEvents: PagedItemsResponse<AuditEvent> | null;
  isLoading: boolean;
  error: string | null;
  fetchAuditEvents: (filters?: AuditFilters) => Promise<PagedItemsResponse<AuditEvent>>;
  clearError: () => void;
  resetStore: () => void;
};

export const useAuditEventsStore = create<AuditEventsStoreState>()((set) => ({
  auditEvents: null,
  isLoading: false,
  error: null,
  fetchAuditEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const auditEvents = await auditEventsApi.list(filters);
      set({ auditEvents, isLoading: false });
      return auditEvents;
    } catch (error) {
      const message = errorMessage(error, "Failed to load audit events");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ auditEvents: null, isLoading: false, error: null }),
}));
