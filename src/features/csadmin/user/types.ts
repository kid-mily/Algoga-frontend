export type UserActivityTab = "friends" | "posts" | "comments";

export type AdminUserSummary = {
  userId: number;
  displayId: string;
  nickname: string;
  email: string;
  createdAt: string;
  friendCount: number;
  postCount: number;
  commentCount: number;
};

export type AdminUserFriend = {
  friendId: number;
  friendNickname: string;
  addedAt: string;
};

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
