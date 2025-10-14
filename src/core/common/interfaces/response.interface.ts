export interface ApiResponse<T = unknown> {
  code?: number;
  status: string;
  data?: T;
  results?: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
