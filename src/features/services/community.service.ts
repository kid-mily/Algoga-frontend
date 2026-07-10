import { api, ApiRequestError, type ApiResult, unwrapData } from "@/lib/api";
import {
  createCommunityPostFormData,
  createCommunityPostUpdateFormData,
} from "@/features/community/utils/communityFormData";
import {
  getItems,
  getRecord,
  normalizeContinent,
  normalizeCountry,
  normalizeFilter,
  normalizePost,
  normalizeReactionResult,
} from "@/features/community/utils/communityNormalizers";

import type {
  CommunityContinent,
  CommunityCountry,
  CommunityFilter,
  CommunityPost,
  CommunityPostPage,
  CommunityReactionResult,
  CreateCommunityCommentPayload,
  CreateCommunityPostPayload,
  GetCommunityPostsParams,
  GetMyCommunityPostsParams,
  ReactToCommunityCommentPayload,
  ReactToCommunityPostPayload,
  ReportCommunityCommentPayload,
  ReportCommunityPostPayload,
  UpdateCommunityCommentPayload,
  UpdateCommunityPostPayload,
} from "@/features/community/types";

export const getCommunityContinents = async (
  signal?: AbortSignal
): Promise<CommunityContinent[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/maps/continents", {
    signal,
  });

  return getItems(unwrapData(response))
    .map(normalizeContinent)
    .filter(Boolean) as CommunityContinent[];
};

export const getCommunityCountries = async (
  continentCode: string,
  signal?: AbortSignal
): Promise<CommunityCountry[]> => {
  const response = await api.get<ApiResult<unknown>>(
    `/api/v1/maps/continents/${continentCode}/countries`,
    { signal }
  );

  return getItems(unwrapData(response)).map(normalizeCountry).filter(Boolean) as CommunityCountry[];
};

export const getCommunityPostTags = async (
  signal?: AbortSignal
): Promise<CommunityFilter[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/posts/tags", {
    signal,
  });

  return getItems(unwrapData(response)).map(normalizeFilter).filter(Boolean) as CommunityFilter[];
};

export const createCommunityPost = async (payload: CreateCommunityPostPayload) => {
  return api.post<ApiResult<unknown>>(
    "/api/v1/posts",
    createCommunityPostFormData(payload),
    {
      suppressGlobalError: true,
    }
  );
};

export const updateCommunityPost = async ({
  postId,
  ...payload
}: UpdateCommunityPostPayload) => {
  return api.put<ApiResult<unknown>>(
    `/api/v1/posts/${postId}`,
    createCommunityPostUpdateFormData({ postId, ...payload }),
    {
      suppressGlobalError: true,
    }
  );
};

export const getCommunityFilters = async (
  signal?: AbortSignal
): Promise<CommunityFilter[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/posts/filters", {
    signal,
  });

  return getItems(unwrapData(response)).map(normalizeFilter).filter(Boolean) as CommunityFilter[];
};

const parseCommunityPostPage = (data: unknown): CommunityPostPage => {
  const record = getRecord(data);
  const posts = getItems(record.posts).map(normalizePost).filter(Boolean) as CommunityPost[];
  const nextLastPostId = Number(record.lastPostId);

  return {
    posts,
    lastPostId: Number.isFinite(nextLastPostId) && nextLastPostId > 0 ? nextLastPostId : null,
    hasNext: Boolean(record.hasNext),
  };
};

export const getCommunityPosts = async ({
  lastPostId,
  categories,
  countryId,
  signal,
}: GetCommunityPostsParams = {}): Promise<CommunityPostPage> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/posts", {
    signal,
    params: {
      lastPostId: lastPostId ?? undefined,
      categories: categories?.length ? categories.join(",") : undefined,
      countryId: countryId ?? undefined,
    },
  });

  return parseCommunityPostPage(unwrapData(response));
};

export const getMyCommunityPosts = async ({
  lastPostId,
  categories,
  signal,
}: GetMyCommunityPostsParams = {}): Promise<CommunityPostPage> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/users/me/posts", {
    signal,
    params: {
      lastPostId: lastPostId ?? undefined,
      categories: categories?.length ? categories.join(",") : undefined,
    },
  });

  return parseCommunityPostPage(unwrapData(response));
};

export const getCommunityPost = async (
  postId: number,
  signal?: AbortSignal
): Promise<CommunityPost> => {
  const response = await api.get<ApiResult<unknown>>(`/api/v1/posts/${postId}`, {
    signal,
  });

  const post = normalizePost(unwrapData(response));
  if (!post) {
    throw new Error("게시글을 불러오지 못했습니다.");
  }

  return post;
};

export const reportCommunityPost = async ({
  postId,
  reasonType = "SPAM",
  detail,
}: ReportCommunityPostPayload) => {
  return api.post<ApiResult<unknown>>(
    "/api/v1/reports",
    {
      targetType: "POST",
      targetId: postId,
      reasonType,
      detail,
    },
    {
      suppressGlobalError: true,
    }
  );
};

export const reportCommunityComment = async ({
  commentId,
  reasonType = "SPAM",
  detail,
}: ReportCommunityCommentPayload) => {
  return api.post<ApiResult<unknown>>(
    "/api/v1/reports",
    {
      targetType: "COMMENT",
      targetId: commentId,
      reasonType,
      detail,
    },
    {
      suppressGlobalError: true,
    }
  );
};

export const deleteCommunityPost = async (postId: number) => {
  return api.delete<ApiResult<unknown>>(`/api/v1/posts/${postId}`, {
    suppressGlobalError: true,
  });
};

export const createCommunityComment = async ({
  postId,
  parentId = null,
  content,
}: CreateCommunityCommentPayload) => {
  return api.post<ApiResult<unknown>>(
    `/api/v1/posts/${postId}/comments`,
    {
      parentId,
      content,
    },
    {
      suppressGlobalError: true,
    }
  );
};

export const updateCommunityComment = async ({
  commentId,
  content,
}: UpdateCommunityCommentPayload) => {
  try {
    return await api.patch<ApiResult<unknown>>(
      `/api/v1/comments/${commentId}`,
      { content },
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 405 || error.message.includes("지원하지 않는 HTTP 메서드"))
    ) {
      return api.put<ApiResult<unknown>>(
        `/api/v1/comments/${commentId}`,
        { content },
        {
          suppressGlobalError: true,
        }
      );
    }

    throw error;
  }
};

export const deleteCommunityComment = async (commentId: number) => {
  return api.delete<ApiResult<unknown>>(`/api/v1/comments/${commentId}`, {
    suppressGlobalError: true,
  });
};

export const reactToCommunityPost = async ({
  postId,
  isLike,
}: ReactToCommunityPostPayload): Promise<CommunityReactionResult> => {
  const response = await api.post<ApiResult<unknown>>(
    "/api/v1/reactions",
    {
      targetType: "POST",
      targetId: postId,
      isLike,
    },
    {
      suppressGlobalError: true,
    }
  );

  return normalizeReactionResult(response);
};

export const reactToCommunityComment = async ({
  commentId,
  isLike,
}: ReactToCommunityCommentPayload): Promise<CommunityReactionResult> => {
  const response = await api.post<ApiResult<unknown>>(
    "/api/v1/reactions",
    {
      targetType: "COMMENT",
      targetId: commentId,
      isLike,
    },
    {
      suppressGlobalError: true,
    }
  );

  return normalizeReactionResult(response);
};
