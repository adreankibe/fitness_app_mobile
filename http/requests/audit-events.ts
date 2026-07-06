import { apiClient } from "@/http/client";
import { toQuery } from "@/http/requests/query";
import type { AuditFilters, PagedItemsResponse } from "@/types";
import type { AuditEvent } from "@/types/api";

const BASE = "/v1/audit-events";

export const auditEventsApi = {
  list: (filters: AuditFilters = {}) =>
    apiClient.get<PagedItemsResponse<AuditEvent>>(
      `${BASE}${toQuery(filters)}`,
    ),
};
