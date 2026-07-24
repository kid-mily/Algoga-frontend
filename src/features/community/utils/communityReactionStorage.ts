import type { ReactionState } from "@/features/community/types";

const STORAGE_KEY = "algoga-community-post-reactions";
const COMMENT_STORAGE_KEY = "algoga-community-comment-reactions";

type StoredReactions = Record<string, boolean>;

const getReactionKey = (userId: number, postId: number) =>
  `${userId}:${postId}`;

const readStoredReactions = (storageKey = STORAGE_KEY): StoredReactions => {
  if (typeof window === "undefined") return {};

  try {
    const value = window.localStorage.getItem(storageKey);
    if (!value) return {};

    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object"
      ? (parsed as StoredReactions)
      : {};
  } catch {
    return {};
  }
};

export const getStoredPostReaction = (
  userId: number,
  postId: number
): ReactionState => {
  const reaction = readStoredReactions()[getReactionKey(userId, postId)];

  return typeof reaction === "boolean" ? reaction : null;
};

export const setStoredPostReaction = (
  userId: number,
  postId: number,
  reaction: ReactionState
) => {
  if (typeof window === "undefined") return;

  try {
    const reactions = readStoredReactions();
    const key = getReactionKey(userId, postId);

    if (reaction === null) {
      delete reactions[key];
    } else {
      reactions[key] = reaction;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
  } catch {
    // 저장소 접근이 제한된 환경에서도 서버 반응 처리는 정상 동작해야 한다.
  }
};

export const getStoredCommentReactions = (
  userId: number
): Record<number, ReactionState> => {
  const stored = readStoredReactions(COMMENT_STORAGE_KEY);

  return Object.entries(stored).reduce<Record<number, ReactionState>>(
    (result, [key, reaction]) => {
      const [storedUserId, commentId] = key.split(":").map(Number);

      if (
        storedUserId === userId &&
        Number.isSafeInteger(commentId) &&
        typeof reaction === "boolean"
      ) {
        result[commentId] = reaction;
      }

      return result;
    },
    {}
  );
};

export const setStoredCommentReaction = (
  userId: number,
  commentId: number,
  reaction: ReactionState
) => {
  if (typeof window === "undefined") return;

  try {
    const reactions = readStoredReactions(COMMENT_STORAGE_KEY);
    const key = getReactionKey(userId, commentId);

    if (reaction === null) {
      delete reactions[key];
    } else {
      reactions[key] = reaction;
    }

    window.localStorage.setItem(
      COMMENT_STORAGE_KEY,
      JSON.stringify(reactions)
    );
  } catch {
    // 저장소 접근이 제한돼도 서버의 댓글 반응 처리는 유지한다.
  }
};
