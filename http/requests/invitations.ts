import { apiClient } from "@/http/client";
import { pathSegment, toQuery } from "@/http/requests/query";
import type { InvitationFilters, ItemsResponse } from "@/types";
import type {
  CreateInvitationRequest,
  Invitation,
  InvitationPreview,
} from "@/types/api";

const BASE = "/v1/invitations";

export const invitationsApi = {
  list: (filters: InvitationFilters = {}) =>
    apiClient.get<ItemsResponse<Invitation>>(`${BASE}${toQuery(filters)}`),
  create: (input: CreateInvitationRequest) =>
    apiClient.post<Invitation>(BASE, input),
  preview: (token: string) =>
    apiClient.get<InvitationPreview>(`${BASE}/${pathSegment(token)}/preview`),
  accept: (token: string, acceptEmailMismatch = false) =>
    apiClient.post<Invitation>(`${BASE}/${pathSegment(token)}/accept`, {
      acceptEmailMismatch,
    }),
  revoke: (invitationId: string) =>
    apiClient.post<Invitation>(`${BASE}/${pathSegment(invitationId)}/revoke`),
  resend: (invitationId: string) =>
    apiClient.post<Invitation>(`${BASE}/${pathSegment(invitationId)}/resend`),
};
