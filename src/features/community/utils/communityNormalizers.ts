import type {
  CommunityCategoryCode,
  CommunityComment,
  CommunityContinent,
  CommunityCountry,
  CommunityFilter,
  CommunityPost,
  CommunityReactionResult,
  CommunityReactionStatus,
} from "@/features/community/types";

export const CATEGORY_LABELS: Record<CommunityCategoryCode, string> = {
  TRAVEL_REVIEW: "여행후기",
  TIP_INFO: "팁&정보",
  QUESTION: "질문",
  COMPANION: "동행 구해요",
  LECTURE: "강의후기",
  FREE: "자유",
};

export const getRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

export const getItems = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const getString = (value: unknown, fallback = "") =>
  typeof value === "string" && value !== "null" ? value : fallback;

const getNumber = (value: unknown, fallback = 0) => {
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const getStringList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const normalizeCategoryCode = (value: unknown): CommunityCategoryCode | undefined => {
  const normalized = getString(value).trim().toUpperCase();

  return normalized in CATEGORY_LABELS ? (normalized as CommunityCategoryCode) : undefined;
};

const formatPostDate = (value: unknown) => {
  const rawDate = getString(value);
  if (!rawDate) return "";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

export const normalizeContinent = (value: unknown): CommunityContinent | null => {
  const record = getRecord(value);
  const continentCode = getString(record.continentCode);
  const continentName = getString(record.continentName);

  if (!continentCode || !continentName) return null;

  return {
    continentCode,
    continentName,
  };
};

export const normalizeCountry = (value: unknown): CommunityCountry | null => {
  const record = getRecord(value);
  const countryId = getNumber(record.countryId);
  const countryName = getString(record.countryName);

  if (countryId <= 0 || !countryName) return null;

  return {
    countryId,
    countryName,
    countryCode: getString(record.countryCode),
    continentCode: getString(record.continentCode),
  };
};

export const normalizeFilter = (value: unknown): CommunityFilter | null => {
  const record = getRecord(value);
  const tagType = getString(record.tagType).toUpperCase();
  const tagName = getString(record.tagName);
  const countryId = getNumber(record.countryId);

  if ((tagType === "COUNTRY" || countryId > 0) && countryId > 0 && tagName) {
    return {
      id: `country-${countryId}`,
      tagType: "COUNTRY",
      tagName,
      countryId,
    };
  }

  const category = normalizeCategoryCode(tagType);

  if (!category) return null;

  return {
    id: category,
    tagType: "CATEGORY",
    tagName: tagName || CATEGORY_LABELS[category],
    category,
  };
};

const getPostTagFilters = (record: Record<string, unknown>) =>
  getItems(record.tags).map(normalizeFilter).filter(Boolean) as CommunityFilter[];

const getPostImageUrls = (record: Record<string, unknown>) => {
  const imageUrls = getStringList(record.imageUrls);
  const thumbnailUrl = getString(record.thumbnailUrl);

  return imageUrls.length > 0 ? imageUrls : thumbnailUrl ? [thumbnailUrl] : [];
};

export const normalizeComment = (value: unknown): CommunityComment | null => {
  const record = getRecord(value);
  const commentId = getNumber(record.commentId);
  const content = getString(record.content);

  if (commentId <= 0) return null;

  const authorName = getString(record.nickname, "익명");
  const replies = getItems(record.replies).map(normalizeComment).filter(Boolean) as CommunityComment[];
  const parentId = getNumber(record.parentId);

  return {
    commentId,
    parentId: parentId > 0 ? parentId : null,
    authorId: getNumber(record.userId) || undefined,
    authorName,
    authorInitial: authorName.trim().slice(0, 1) || "?",
    authorProfileImageUrl: getString(record.profileImageUrl) || null,
    createdAt: formatPostDate(record.createdAt),
    content,
    likeCount: getNumber(record.likeCount),
    dislikeCount: getNumber(record.dislikeCount),
    isMine: getBoolean(record.isMine),
    replies,
  };
};

export const toCommentList = (value: unknown): CommunityComment[] =>
  getItems(value).map(normalizeComment).filter(Boolean) as CommunityComment[];

export const normalizePost = (value: unknown): CommunityPost | null => {
  const record = getRecord(value);
  const postId = getNumber(record.postId);
  const title = getString(record.title);

  if (postId <= 0 || !title) return null;

  const tagFilters = getPostTagFilters(record);
  const categoryCode = tagFilters.find((filter) => filter.tagType === "CATEGORY")?.category;
  const imageUrls = getPostImageUrls(record);
  const imageUrl = imageUrls[0] ?? null;
  const authorName = getString(record.authorNickname, "익명");
  const countryId = getNumber(record.countryId);

  return {
    postId,
    authorId: getNumber(record.authorId) || undefined,
    authorName,
    authorInitial: authorName.trim().slice(0, 1) || "?",
    authorProfileImageUrl: getString(record.authorProfileImageUrl) || null,
    countryId: countryId > 0 ? countryId : undefined,
    country: getString(record.countryName, "여행"),
    category: categoryCode ? CATEGORY_LABELS[categoryCode] : "자유",
    categoryCode,
    createdAt: formatPostDate(record.createdAt),
    title,
    content: getString(record.content),
    imageUrl,
    imageUrls,
    imageAlt: title,
    imageIndex: imageUrl ? 1 : 0,
    imageTotal: imageUrls.length,
    likeCount: getNumber(record.likeCount),
    dislikeCount: getNumber(record.dislikeCount),
    commentCount: getNumber(record.commentCount),
    viewCount: getNumber(record.viewCount),
    isMine: getBoolean(record.isMine),
    comments: toCommentList(record.comments),
  };
};

export const normalizeReactionResult = (response: unknown): CommunityReactionResult => {
  const responseRecord = getRecord(response);
  const data = getRecord(responseRecord.data ?? response);

  return {
    status: getString(data.status, "ADDED") as CommunityReactionStatus,
    likeCount: getNumber(data.likeCount),
    dislikeCount: getNumber(data.dislikeCount),
  };
};
