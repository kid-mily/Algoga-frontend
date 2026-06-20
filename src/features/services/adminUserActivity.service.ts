import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminUserComment,
  AdminUserFriend,
  AdminUserPost,
  AdminUserSummary,
  UserActivityPage,
} from "@/features/csadmin/user/types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
};

const toText = (value: unknown, fallback = "-") => {
  if (typeof value === "string" && value.trim() !== "") {
    if (value === "null") return fallback;
    return value;
  }
  if (typeof value === "number") return String(value);

  return fallback;
};

const formatDate = (value: unknown) => {
  const text = toText(value, "");
  if (!text) return "-";

  const dateMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) return `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}`;

  return text;
};

const unwrapItems = (data: unknown, keys: string[]) => {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];

  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }

  return [];
};

const getTotalPages = (data: unknown, fallback: number) => {
  if (!isRecord(data)) return fallback;
  return Math.max(1, toNumber(data.totalPages ?? data.totalPage, fallback));
};

const getTotalElements = (data: unknown, fallback: number) => {
  if (!isRecord(data)) return fallback;
  return toNumber(data.totalElements ?? data.totalCount ?? data.total, fallback);
};

const getCurrentPage = (data: unknown, fallback: number) => {
  if (!isRecord(data)) return fallback;
  return toNumber(data.currentPage ?? data.page ?? data.number, fallback);
};

const normalizeUserSummary = (item: unknown): AdminUserSummary | null => {
  if (!isRecord(item)) return null;

  const userId = toNumber(item.userId ?? item.id);
  if (!Number.isSafeInteger(userId) || userId <= 0) return null;

  return {
    userId,
    displayId: `U${String(userId).padStart(3, "0")}`,
    nickname: toText(item.nickname ?? item.name ?? item.userName, "이름 없음"),
    email: toText(item.email, "-"),
    createdAt: formatDate(item.createdAt ?? item.joinedAt ?? item.registeredAt),
    friendCount: toNumber(item.friendCount ?? item.friends),
    postCount: toNumber(item.postCount ?? item.posts),
    commentCount: toNumber(item.commentCount ?? item.comments),
  };
};

const normalizePost = (item: unknown): AdminUserPost | null => {
  if (!isRecord(item)) return null;

  const postId = toNumber(item.postId ?? item.id);
  if (!Number.isSafeInteger(postId) || postId <= 0) return null;

  return {
    postId,
    displayId: `P${String(postId).padStart(3, "0")}`,
    title: toText(item.title ?? item.postTitle, "제목 없음"),
    content: toText(item.content ?? item.body, ""),
    createdAt: formatDate(item.createdAt ?? item.createdDate ?? item.date),
    viewCount: toNumber(item.viewCount ?? item.views),
    commentCount: toNumber(item.commentCount ?? item.comments),
  };
};

const normalizeComment = (item: unknown): AdminUserComment | null => {
  if (!isRecord(item)) return null;

  const commentId = toNumber(item.commentId ?? item.id);
  if (!Number.isSafeInteger(commentId) || commentId <= 0) return null;

  const postId = toNumber(item.postId, 0);

  return {
    commentId,
    displayId: `C${String(commentId).padStart(3, "0")}`,
    postId: postId > 0 ? postId : undefined,
    postTitle: toText(item.postTitle ?? item.title, "-"),
    content: toText(item.content ?? item.comment, ""),
    createdAt: formatDate(item.createdAt ?? item.createdDate ?? item.date),
  };
};

const normalizeFriend = (item: unknown): AdminUserFriend | null => {
  if (!isRecord(item)) return null;

  const friendId = toNumber(item.friendId ?? item.userId ?? item.id);
  if (!Number.isSafeInteger(friendId) || friendId <= 0) return null;

  return {
    friendId,
    friendNickname: toText(
      item.friendNickname ?? item.nickname ?? item.name,
      "이름 없음"
    ),
    addedAt: formatDate(item.addedAt ?? item.createdAt ?? item.friendCreatedAt),
  };
};

export const getAdminUsers = async (
  page = 1,
  size = 10,
  signal?: AbortSignal
): Promise<UserActivityPage<AdminUserSummary>> => {
  const response = await adminApi.get<ApiResult<unknown>>("/api/v1/admin/users", {
    params: { page: Math.max(0, page - 1), size },
    signal,
    suppressGlobalError: true,
  });
  const data = unwrapData<unknown>(response);
  const items = unwrapItems(data, ["content", "users", "items", "data"])
    .map(normalizeUserSummary)
    .filter((user): user is AdminUserSummary => user !== null);

  return {
    items,
    page: getCurrentPage(data, page - 1) + 1,
    totalPages: getTotalPages(data, 1),
    totalElements: getTotalElements(data, items.length),
  };
};

export const getAdminUserDetail = async (
  userId: number,
  signal?: AbortSignal
) => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/admin/users/${userId}`,
    { signal, suppressGlobalError: true }
  );

  return unwrapData<unknown>(response);
};

export const getAdminUserPosts = async (
  userId: number,
  index = 1,
  signal?: AbortSignal
): Promise<UserActivityPage<AdminUserPost>> => {
  const detail = await getAdminUserDetail(userId, signal);
  const postsData = isRecord(detail) ? detail.posts : {};
  const items = unwrapItems(postsData, ["content", "posts", "items", "data"])
    .map(normalizePost)
    .filter((post): post is AdminUserPost => post !== null);

  return {
    items,
    page: getCurrentPage(postsData, index),
    totalPages: getTotalPages(postsData, 1),
    totalElements: getTotalElements(postsData, items.length),
  };
};

export const getAdminPostDetail = async (
  postId: number,
  signal?: AbortSignal
): Promise<AdminUserPost | null> => {
  void postId;
  void signal;
  return null;
};

export const deleteAdminPost = async (postId: number): Promise<void> => {
  await adminApi.delete<ApiResult<unknown>>(`/api/v1/posts/admin/${postId}`, {
    suppressGlobalError: true,
  });
};

export const getAdminUserComments = async (
  userId: number,
  index = 1,
  signal?: AbortSignal
): Promise<UserActivityPage<AdminUserComment>> => {
  const detail = await getAdminUserDetail(userId, signal);
  const commentsData = isRecord(detail) ? detail.comments : {};
  const items = unwrapItems(commentsData, ["content", "comments", "items", "data"])
    .map(normalizeComment)
    .filter((comment): comment is AdminUserComment => comment !== null);

  return {
    items,
    page: getCurrentPage(commentsData, index),
    totalPages: getTotalPages(commentsData, 1),
    totalElements: getTotalElements(commentsData, items.length),
  };
};

export const getAdminCommentDetail = async (
  commentId: number,
  signal?: AbortSignal
): Promise<AdminUserComment | null> => {
  void commentId;
  void signal;
  return null;
};

export const deleteAdminComment = async (commentId: number): Promise<void> => {
  await adminApi.delete<ApiResult<unknown>>(`/api/v1/comments/admin/${commentId}`, {
    suppressGlobalError: true,
  });
};

export const getAdminUserFriends = async (
  userId: number,
  signal?: AbortSignal
): Promise<AdminUserFriend[]> => {
  const detail = await getAdminUserDetail(userId, signal);
  const items = isRecord(detail) ? unwrapItems(detail.friends, ["friends"]) : [];

  return items
    .map(normalizeFriend)
    .filter((friend): friend is AdminUserFriend => friend !== null);
};
