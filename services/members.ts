import { apiClient } from "@/http/client";
import type { MemberDetail, MemberSummary, OrganizationRole } from "@/types/api";
import type { PagedItemsResponse, QueryBase } from "@/types";

export type MemberFilters = QueryBase & {
  role?: string;
  status?: string;
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

export const membersService = {
  list: (filters: MemberFilters = {}) =>
    apiClient.get<PagedItemsResponse<MemberSummary>>(
      `/v1/members${toQuery(filters)}`,
    ),
  get: (membershipId: string) =>
    apiClient.get<MemberDetail>(`/v1/members/${membershipId}`),
  changeRole: (membershipId: string, role: OrganizationRole) =>
    apiClient.patch<MemberDetail>(`/v1/members/${membershipId}/role`, { role }),
  suspend: (membershipId: string, reason?: string) =>
    apiClient.post<MemberDetail>(`/v1/members/${membershipId}/suspend`, {
      reason,
    }),
  reactivate: (membershipId: string) =>
    apiClient.post<MemberDetail>(`/v1/members/${membershipId}/reactivate`),
  revoke: (membershipId: string, reason?: string) =>
    apiClient.delete<void>(`/v1/members/${membershipId}`, {
      body: JSON.stringify({ reason }),
      headers: { "Content-Type": "application/json" },
    }),
};
