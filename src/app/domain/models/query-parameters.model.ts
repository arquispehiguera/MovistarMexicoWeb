export interface QueryParameters {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  searchTerm?: string;
}
