import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminUserComment,
  AdminUserPost,
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
  if (typeof value === "string" && value.trim() !== "") return value;
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

export const getAdminUserPosts = async (
  userId: number,
  index = 1,
  signal?: AbortSignal
): Promise<UserActivityPage<AdminUserPost>> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/posts/admin/users/${userId}`,
    {
      params: { index },
      signal,
      suppressGlobalError: true,
    }
  );
  const data = unwrapData<unknown>(response);
  const items = unwrapItems(data, ["content", "posts", "items", "data"])
    .map(normalizePost)
    .filter((post): post is AdminUserPost => post !== null);

  return {
    items,
    page: index,
    totalPages: getTotalPages(data, 1),
    totalElements: getTotalElements(data, items.length),
  };
};

export const getAdminPostDetail = async (
  postId: number,
  signal?: AbortSignal
): Promise<AdminUserPost | null> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/posts/admin/${postId}`,
    { signal, suppressGlobalError: true }
  );
  return normalizePost(unwrapData<unknown>(response));
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
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/comments/admin/users/${userId}`,
    {
      params: { index },
      signal,
      suppressGlobalError: true,
    }
  );
  const data = unwrapData<unknown>(response);
  const items = unwrapItems(data, ["content", "comments", "items", "data"])
    .map(normalizeComment)
    .filter((comment): comment is AdminUserComment => comment !== null);

  return {
    items,
    page: index,
    totalPages: getTotalPages(data, 1),
    totalElements: getTotalElements(data, items.length),
  };
};

export const getAdminCommentDetail = async (
  commentId: number,
  signal?: AbortSignal
): Promise<AdminUserComment | null> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/comments/admin/${commentId}`,
    { signal, suppressGlobalError: true }
  );
  return normalizeComment(unwrapData<unknown>(response));
};

export const deleteAdminComment = async (commentId: number): Promise<void> => {
  await adminApi.delete<ApiResult<unknown>>(`/api/v1/comments/admin/${commentId}`, {
    suppressGlobalError: true,
  });
};
