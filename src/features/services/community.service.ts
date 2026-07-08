import { api, type ApiResult, unwrapData } from "@/lib/api";

export type CommunityCategoryCode =
  | "TRAVEL_REVIEW"
  | "TIP_INFO"
  | "QUESTION"
  | "COMPANION"
  | "LECTURE"
  | "FREE";

export type CommunityFilter = {
  id: string;
  tagType: "CATEGORY" | "COUNTRY";
  tagName: string;
  category?: CommunityCategoryCode;
  countryId?: number;
};

export type CommunityPost = {
  postId: number;
  authorName: string;
  authorInitial: string;
  country: string;
  category: string;
  categoryCode?: CommunityCategoryCode;
  createdAt: string;
  title: string;
  content: string;
  imageUrl: string | null;
  imageAlt: string;
  imageIndex: number;
  imageTotal: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  viewCount: number;
};

export type CommunityPostPage = {
  posts: CommunityPost[];
  lastPostId: number | null;
  hasNext: boolean;
};

export type CommunityReactionStatus = "ADDED" | "REMOVED" | "CHANGED";

export type CommunityReactionResult = {
  status: CommunityReactionStatus;
  likeCount: number;
  dislikeCount: number;
};

export type CommunityReportReasonType =
  | "SPAM"
  | "ABUSE"
  | "INAPPROPRIATE"
  | "ADVERTISEMENT"
  | "ETC";

export type GetCommunityPostsParams = {
  lastPostId?: number | null;
  categories?: CommunityCategoryCode[];
  countryId?: number | null;
  signal?: AbortSignal;
};

const CATEGORY_LABELS: Record<CommunityCategoryCode, string> = {
  TRAVEL_REVIEW: "여행후기",
  TIP_INFO: "팁&정보",
  QUESTION: "질문",
  COMPANION: "동행 구해요",
  LECTURE: "수강강의",
  FREE: "자유",
};

const CATEGORY_ALIASES: Record<string, CommunityCategoryCode> = {
  "여행후기": "TRAVEL_REVIEW",
  "여행 후기": "TRAVEL_REVIEW",
  "팁정보": "TIP_INFO",
  "팁 정보": "TIP_INFO",
  "팁&정보": "TIP_INFO",
  "팁 & 정보": "TIP_INFO",
  "질문": "QUESTION",
  "동행구해요": "COMPANION",
  "동행 구해요": "COMPANION",
  "수강강의": "LECTURE",
  "강의후기": "LECTURE",
  "강의 후기": "LECTURE",
  "자유": "FREE",
  "자유(커스텀태그)": "FREE",
};

const getRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getItems = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;

  const record = getRecord(value);
  const candidates = [
    record.content,
    record.items,
    record.posts,
    record.postList,
    record.filters,
    record.tags,
    record.list,
  ];

  return candidates.find(Array.isArray) as unknown[] ?? [];
};

const getString = (
  record: Record<string, unknown>,
  keys: string[],
  fallback = ""
) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null && item !== "");

  return typeof value === "string" ? value : value === undefined ? fallback : String(value);
};

const getNumber = (
  record: Record<string, unknown>,
  keys: string[],
  fallback = 0
) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null && item !== "");
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getBoolean = (
  record: Record<string, unknown>,
  keys: string[],
  fallback = false
) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null);

  return typeof value === "boolean" ? value : fallback;
};

const normalizeCategoryCode = (value: string): CommunityCategoryCode | undefined => {
  const normalized = value.trim().toUpperCase();

  if (normalized in CATEGORY_LABELS) {
    return normalized as CommunityCategoryCode;
  }

  const compactLabel = value.trim().replace(/\s+/g, "");
  return CATEGORY_ALIASES[value.trim()] ?? CATEGORY_ALIASES[compactLabel];
};

const formatPostDate = (value: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const normalizeFilter = (value: unknown): CommunityFilter | null => {
  const record = getRecord(value);
  const tagType = getString(record, ["tagType", "type"]).toUpperCase();
  const tagName = getString(record, ["tagName", "name", "label"]);
  const rawCategory = getString(record, ["category", "categoryCode", "code", "tagCode"]);
  const category = normalizeCategoryCode(rawCategory || tagType);
  const countryId = getNumber(record, ["countryId", "country_id"], 0);

  if ((tagType === "COUNTRY" || countryId > 0) && countryId > 0 && tagName) {
    return {
      id: `country-${countryId}`,
      tagType: "COUNTRY",
      tagName,
      countryId,
    };
  }

  if (category) {
    return {
      id: category,
      tagType: "CATEGORY",
      tagName: tagName || CATEGORY_LABELS[category],
      category,
    };
  }

  return null;
};

const getPostTagFilters = (record: Record<string, unknown>) => {
  const tagCandidates = [
    record.tags,
    record.tagList,
    record.postTags,
    record.postTagList,
    record.filters,
  ];

  return tagCandidates
    .flatMap(getItems)
    .map(normalizeFilter)
    .filter(Boolean) as CommunityFilter[];
};

const getFirstImageUrl = (record: Record<string, unknown>) => {
  const directImage = getString(record, [
    "imageUrl",
    "thumbnailUrl",
    "thumbnail",
    "firstImageUrl",
  ]);

  if (directImage) return directImage;

  const images = getItems(record.images ?? record.imageUrls ?? record.files);
  const firstImage = images[0];

  if (typeof firstImage === "string") return firstImage;

  if (firstImage && typeof firstImage === "object") {
    return getString(firstImage as Record<string, unknown>, ["url", "imageUrl", "fileUrl"]);
  }

  return "";
};

const normalizePost = (value: unknown): CommunityPost | null => {
  const record = getRecord(value);
  const postId = getNumber(record, ["postId", "id"]);
  const title = getString(record, ["title", "postTitle"]);

  if (postId <= 0 || !title) return null;

  const tagFilters = getPostTagFilters(record);
  const categoryFilter = tagFilters.find((filter) => filter.tagType === "CATEGORY");
  const countryFilter = tagFilters.find((filter) => filter.tagType === "COUNTRY");
  const rawCategory = getString(record, [
    "category",
    "categoryCode",
    "postCategory",
    "categoryName",
    "tagType",
    "type",
  ]);
  const categoryCode = normalizeCategoryCode(rawCategory) ?? categoryFilter?.category;
  const directCountry = getString(record, ["country", "countryName"]);
  const countryTagName =
    getNumber(record, ["countryId", "country_id"]) > 0
      ? getString(record, ["tagName"])
      : "";
  const authorName = getString(record, [
    "authorName",
    "nickname",
    "writer",
    "writerName",
    "memberName",
  ], "익명");
  const imageUrl = getFirstImageUrl(record);
  const imageTotal = Math.max(
    getNumber(record, ["imageTotal", "imageCount"], imageUrl ? 1 : 0),
    imageUrl ? 1 : 0
  );

  return {
    postId,
    authorName,
    authorInitial: authorName.trim().slice(0, 1) || "?",
    country: countryFilter?.tagName || directCountry || countryTagName || "여행",
    category: categoryCode
      ? CATEGORY_LABELS[categoryCode]
      : getString(record, ["categoryName", "category"], "자유"),
    categoryCode,
    createdAt: formatPostDate(getString(record, ["createdAt", "createdDate", "regDate"], "")),
    title,
    content: getString(record, ["content", "body", "description"], ""),
    imageUrl: imageUrl || null,
    imageAlt: title,
    imageIndex: getNumber(record, ["imageIndex"], imageUrl ? 1 : 0),
    imageTotal,
    likeCount: getNumber(record, ["likeCount", "likes"]),
    dislikeCount: getNumber(record, ["dislikeCount", "dislikes"]),
    commentCount: getNumber(record, ["commentCount", "comments"]),
    viewCount: getNumber(record, ["viewCount", "views"]),
  };
};

export const getCommunityFilters = async (
  signal?: AbortSignal
): Promise<CommunityFilter[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/posts/filters", {
    signal,
  });

  return getItems(unwrapData(response)).map(normalizeFilter).filter(Boolean) as CommunityFilter[];
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
  const data = unwrapData(response);
  const record = getRecord(data);
  const posts = getItems(data).map(normalizePost).filter(Boolean) as CommunityPost[];

  return {
    posts,
    lastPostId:
      getNumber(record, ["lastPostId", "nextLastPostId"], posts.at(-1)?.postId ?? 0) ||
      null,
    hasNext: getBoolean(record, ["hasNext", "hasMore"], false),
  };
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
}: {
  postId: number;
  reasonType?: CommunityReportReasonType;
  detail: string;
}) => {
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

export const reactToCommunityPost = async ({
  postId,
  isLike,
}: {
  postId: number;
  isLike: boolean;
}): Promise<CommunityReactionResult> => {
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
  const responseRecord = getRecord(response);
  const data = getRecord(unwrapData(response));

  return {
    status: getString(data, ["status"], getString(responseRecord, ["status"], "ADDED")) as CommunityReactionStatus,
    likeCount: getNumber(data, ["likeCount"], getNumber(responseRecord, ["likeCount"])),
    dislikeCount: getNumber(
      data,
      ["dislikeCount"],
      getNumber(responseRecord, ["dislikeCount"])
    ),
  };
};
