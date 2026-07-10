import type { CommunityCategoryCode, CommunityFilter } from "./category";
import type { CommunityComment } from "./comment";
import type { ReactionState } from "./reaction";

export type CommunityPost = {
  postId: number;
  authorId?: number;
  authorName: string;
  authorInitial: string;
  authorProfileImageUrl?: string | null;
  countryId?: number;
  country: string;
  category: string;
  categoryCode?: CommunityCategoryCode;
  createdAt: string;
  title: string;
  content: string;
  imageUrl: string | null;
  imageUrls: string[];
  imageAlt: string;
  imageIndex: number;
  imageTotal: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  viewCount: number;
  isMine: boolean;
  comments: CommunityComment[];
};

export type CommunityPostPage = {
  posts: CommunityPost[];
  lastPostId: number | null;
  hasNext: boolean;
};

export type CommunityCardProps = Pick<
  CommunityPost,
  | "postId"
  | "authorName"
  | "authorInitial"
  | "authorProfileImageUrl"
  | "countryId"
  | "country"
  | "category"
  | "createdAt"
  | "title"
  | "content"
  | "imageUrl"
  | "imageAlt"
  | "imageIndex"
  | "imageTotal"
  | "likeCount"
  | "dislikeCount"
  | "commentCount"
>;

export type CommunityPostDetailProps = {
  postId: number;
};

export type CommunityPostHeaderProps = {
  post: CommunityPost;
  authorProfileImageUrl?: string | null;
  isOwnPost: boolean;
  isDeleting: boolean;
  isReporting: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
  onReport: () => void;
};

export type CommunityPostImageCarouselProps = {
  imageUrls: string[];
  fallbackImageUrl?: string | null;
  imageAlt: string;
  currentImageIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

export type CommunityPostStatsProps = {
  post: CommunityPost;
  reaction: ReactionState;
  isReacting: boolean;
  onReaction: (isLike: boolean) => void;
};

export type CommunityPageClientProps = {
  initialFilters: CommunityFilter[];
  initialPosts: CommunityPost[];
  initialLastPostId: number | null;
  initialHasNext: boolean;
  initialErrorMessage?: string;
};

export type GetCommunityPostsParams = {
  lastPostId?: number | null;
  categories?: CommunityCategoryCode[];
  countryId?: number | null;
  signal?: AbortSignal;
};

export type GetMyCommunityPostsParams = {
  lastPostId?: number | null;
  categories?: CommunityCategoryCode[];
  signal?: AbortSignal;
};

export type CreateCommunityPostPayload = {
  title: string;
  content: string;
  countryId?: number | null;
  tagType: CommunityCategoryCode;
  customTags?: string[];
  images?: File[];
};

export type UpdateCommunityPostPayload = CreateCommunityPostPayload & {
  postId: number;
  existingImageUrls?: string[];
  deletedImageUrls?: string[];
};
