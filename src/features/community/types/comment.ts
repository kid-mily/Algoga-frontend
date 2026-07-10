import type { ReactionState } from "./reaction";

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
  onReply: (commentId: number, content: string) => void;
  activeReplyCommentId?: number | null;
  replyContent?: string;
  isReplySubmitting?: boolean;
  canReply?: boolean;
  onReplyContentChange?: (value: string) => void;
  onCancelReply?: () => void;
  onOpenReply?: (commentId: number) => void;
};

export type CommunityCommentSectionProps = {
  postId: number;
  initialCommentCount: number;
  initialComments?: CommunityComment[];
  currentUserId: number | null;
  onCommentCountChange?: (count: number) => void;
};

export type CommunityCommentTextDialogState =
  | {
      type: "edit";
      commentId: number;
      value: string;
    }
  | null;

export type CommentDropdownProps = {
  isMine: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
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
