export type UserActivityTab = "friends" | "posts" | "comments";

export type UserActivityPage<T> = {
  items: T[];
  page: number;
  totalPages: number;
  totalElements: number;
};

export type AdminUserPost = {
  postId: number;
  displayId: string;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
};

export type AdminUserComment = {
  commentId: number;
  displayId: string;
  postId?: number;
  postTitle: string;
  content: string;
  createdAt: string;
};
