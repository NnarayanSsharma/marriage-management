export type ApiError = {
  error: { code: string; message: string; details?: Record<string, string> };
};

export type ApiResource<T> = { data: T };
export type PagePagination = { page: number; limit: number; total: number; totalPages: number };
export type ApiCollection<T> = { data: T[]; pagination: PagePagination };
export type ApiCursorCollection<T> = { data: T[]; pagination: { nextCursor: string | null } };
