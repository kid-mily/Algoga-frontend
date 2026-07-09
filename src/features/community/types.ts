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

export type CommunityCategoryOption = {
  id: string;
  label: string;
};

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
  profileText: string;
  value: string;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export type CommunityCommentItemProps = {
  currentUserId?: number | null;
  comment: import("@/features/services/community.service").CommunityComment;
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
