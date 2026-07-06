import { apiClient } from "@/http/client";
import type { AuditEvent } from "@/types/api";
import type { PagedItemsResponse } from "@/types";

export type AuditFilters = {
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

function toQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const auditEventsService = {
  list: (filters: AuditFilters = {}) =>
    apiClient.get<PagedItemsResponse<AuditEvent>>(
      `/v1/audit-events${toQuery(filters)}`,
    ),
};
