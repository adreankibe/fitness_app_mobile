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
