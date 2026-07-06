// Shared generic helpers used across mobile domain modules.

export type Id = string;

export type ItemsResponse<T> = {
  items: T[];
};

export type PagedItemsResponse<T> = ItemsResponse<T> & {
  page: number;
  pageSize: number;
  total: number;
};

export type QueryBase = {
  page?: number;
  pageSize?: number;
  q?: string;
};

export type MemberFilters = QueryBase & {
  role?: string;
  status?: string;
};

export type TeamFilters = {
  status?: string;
  q?: string;
};

export type InvitationFilters = {
  status?: string;
  email?: string;
};

export type AuditFilters = {
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};
