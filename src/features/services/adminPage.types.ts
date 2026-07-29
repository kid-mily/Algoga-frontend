export type AdminPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type AdminPageParams = {
  page?: number;
  size?: number;
  courseId?: number;
  keyword?: string;
};
