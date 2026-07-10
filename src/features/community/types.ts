export type CommunityCardProps = {
  postId: number;
  authorName: string;
  authorInitial: string;
  authorProfileImageUrl?: string | null;
  country: string;
  category: string;
  createdAt: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt: string;
  imageIndex?: number;
  imageTotal?: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
};

export type CommunityCategoryCode =
  | "TRAVEL_REVIEW"
  | "TIP_INFO"
  | "QUESTION"
  | "COMPANION"
  | "LECTURE"
  | "FREE";

export type CommunityCategoryOption = {
  id: string;
  label: string;
};

export const COMMUNITY_CATEGORIES: Array<{
  id: CommunityCategoryCode;
  label: string;
}> = [
  { id: "TRAVEL_REVIEW", label: "여행후기" },
  { id: "TIP_INFO", label: "팁&정보" },
  { id: "QUESTION", label: "질문" },
  { id: "COMPANION", label: "동행 구해요" },
  { id: "LECTURE", label: "수강강의" },
  { id: "FREE", label: "자유" },
];

export type CommunityWriteButtonProps = {
  onClick?: () => void;
};

export type CommunityStatProps = {
  icon: string;
  label: string;
  count: number;
};

export type CommunityCategoryTabsProps = {
  selectedCategories: string[];
  categories: CommunityCategoryOption[];
  onCategoryChange: (category: string) => void;
};

export type CommunityActionModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type CommunityCommentFormProps = {
  value: string;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export type CommunityCommentItemProps = {
  currentUserId?: number | null;
  comment: CommunityComment;
  reactionByCommentId?: Record<number, ReactionState>;
  pendingCommentId?: number | null;
  onReact: (commentId: number, isLike: boolean) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
};

export type CommunityHeaderProps = {
  selectedCategories: string[];
  categories: CommunityCategoryOption[];
  onCategoryChange: (category: string) => void;
  onWriteClick?: () => void;
};

export type CommunityPostDetailProps = {
  postId: number;
};

export type ReactionState = true | false | null;

export type CommunityFilter = {
  id: string;
  tagType: "CATEGORY" | "COUNTRY";
  tagName: string;
  category?: CommunityCategoryCode;
  countryId?: number;
};

export type CommunityContinent = {
  continentCode: string;
  continentName: string;
};

export type CommunityCountry = {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
};

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

export type CommunityComment = {
  commentId: number;
  parentId: number | null;
  authorId?: number;
  authorName: string;
  authorInitial: string;
  authorProfileImageUrl?: string | null;
  createdAt: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  isMine: boolean;
  replies: CommunityComment[];
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
  | "FALSE_INFO"
  | "INAPPROPRIATE"
  | "COPYRIGHT"
  | "ETC";

export type CommunityReportTargetType = "게시글" | "댓글";

export type CommunityReportReasonOption = {
  label: string;
  value: CommunityReportReasonType;
};

export type CommunityReportModalProps = {
  open: boolean;
  targetType: CommunityReportTargetType;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => void;
};

export const REPORT_REASONS: CommunityReportReasonOption[] = [
  { label: "스팸/광고", value: "SPAM" },
  { label: "욕설/비방", value: "ABUSE" },
  { label: "허위정보", value: "FALSE_INFO" },
  { label: "부적절한 콘텐츠", value: "INAPPROPRIATE" },
  { label: "저작권 침해", value: "COPYRIGHT" },
  { label: "기타", value: "ETC" },
];

export type GetCommunityPostsParams = {
  lastPostId?: number | null;
  categories?: CommunityCategoryCode[];
  countryId?: number | null;
  signal?: AbortSignal;
};

export type CreateCommunityPostPayload = {
  title: string;
  content: string;
  countryId: number;
  tagType: CommunityCategoryCode;
  customTags?: string[];
  images?: File[];
};

export type UpdateCommunityPostPayload = CreateCommunityPostPayload & {
  postId: number;
  existingImageUrls?: string[];
  deletedImageUrls?: string[];
};

export type ReportCommunityPostPayload = {
  postId: number;
  reasonType?: CommunityReportReasonType;
  detail: string;
};

export type ReportCommunityCommentPayload = {
  commentId: number;
  reasonType?: CommunityReportReasonType;
  detail: string;
};

export type CreateCommunityCommentPayload = {
  postId: number;
  parentId?: number | null;
  content: string;
};

export type UpdateCommunityCommentPayload = {
  commentId: number;
  content: string;
};

export type ReactToCommunityPostPayload = {
  postId: number;
  isLike: boolean;
};

export type ReactToCommunityCommentPayload = {
  commentId: number;
  isLike: boolean;
};

export type CommunityPageClientProps = {
  initialFilters: CommunityFilter[];
  initialPosts: CommunityPost[];
  initialLastPostId: number | null;
  initialHasNext: boolean;
  initialErrorMessage?: string;
};