import { apiClient } from "@/http/client";
import { pathSegment, toQuery } from "@/http/requests/query";
import type { MemberFilters, PagedItemsResponse } from "@/types";
import type { MemberDetail, MemberSummary, OrganizationRole } from "@/types/api";

const BASE = "/v1/members";

export const membersApi = {
  list: (filters: MemberFilters = {}) =>
    apiClient.get<PagedItemsResponse<MemberSummary>>(
      `${BASE}${toQuery(filters)}`,
    ),
  get: (membershipId: string) =>
    apiClient.get<MemberDetail>(`${BASE}/${pathSegment(membershipId)}`),
  changeRole: (membershipId: string, role: OrganizationRole) =>
    apiClient.patch<MemberDetail>(`${BASE}/${pathSegment(membershipId)}/role`, { role }),
  suspend: (membershipId: string, reason?: string) =>
    apiClient.post<MemberDetail>(`${BASE}/${pathSegment(membershipId)}/suspend`, { reason }),
  reactivate: (membershipId: string) =>
    apiClient.post<MemberDetail>(`${BASE}/${pathSegment(membershipId)}/reactivate`),
  revoke: (membershipId: string, reason?: string) =>
    apiClient.delete<void>(`${BASE}/${pathSegment(membershipId)}`, {
      body: JSON.stringify({ reason }),
      headers: { "Content-Type": "application/json" },
    }),
};
