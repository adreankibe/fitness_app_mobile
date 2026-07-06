import { apiClient } from "@/http/client";
import type {
  CreateInvitationRequest,
  Invitation,
  InvitationPreview,
} from "@/types/api";
import type { ItemsResponse } from "@/types";

export type InvitationFilters = {
  status?: string;
  email?: string;
};

function toQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const invitationsService = {
  list: (filters: InvitationFilters = {}) =>
    apiClient.get<ItemsResponse<Invitation>>(
      `/v1/invitations${toQuery(filters)}`,
    ),
  create: (input: CreateInvitationRequest) =>
    apiClient.post<Invitation>("/v1/invitations", input),
  preview: (token: string) =>
    apiClient.get<InvitationPreview>(`/v1/invitations/${token}/preview`),
  accept: (token: string, acceptEmailMismatch = false) =>
    apiClient.post<Invitation>(`/v1/invitations/${token}/accept`, {
      acceptEmailMismatch,
    }),
  revoke: (invitationId: string) =>
    apiClient.post<Invitation>(`/v1/invitations/${invitationId}/revoke`),
  resend: (invitationId: string) =>
    apiClient.post<Invitation>(`/v1/invitations/${invitationId}/resend`),
};
