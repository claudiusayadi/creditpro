export interface IApiResponse<T = unknown> {
  code?: number;
  status: string;
  data?: T;
  results?: number;
  meta?: {
    currentPage: number;
    items: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
