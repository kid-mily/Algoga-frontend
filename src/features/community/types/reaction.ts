export type ReactionState = true | false | null;

export type CommunityReactionStatus = "ADDED" | "REMOVED" | "CHANGED";

export type CommunityReactionResult = {
  status: CommunityReactionStatus;
  likeCount: number;
  dislikeCount: number;
};

export type ReactToCommunityPostPayload = {
  postId: number;
  isLike: boolean;
};

export type ReactToCommunityCommentPayload = {
  commentId: number;
  isLike: boolean;
};
