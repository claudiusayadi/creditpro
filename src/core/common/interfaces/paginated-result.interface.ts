export interface IPaginatedResult<T> {
  data: T[];
  meta: {
    currentPage: number;
    items: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
