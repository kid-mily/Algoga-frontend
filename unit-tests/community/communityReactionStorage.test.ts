import {
  getStoredCommentReactions,
  getStoredPostReaction,
  setStoredCommentReaction,
  setStoredPostReaction,
} from "@/features/community/utils/communityReactionStorage";

describe("communityReactionStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("사용자와 게시글별 좋아요 선택을 저장하고 복원한다", () => {
    setStoredPostReaction(10, 100, true);

    expect(getStoredPostReaction(10, 100)).toBe(true);
    expect(getStoredPostReaction(10, 101)).toBeNull();
    expect(getStoredPostReaction(11, 100)).toBeNull();
  });

  test("싫어요 선택도 별도로 저장한다", () => {
    setStoredPostReaction(10, 100, false);

    expect(getStoredPostReaction(10, 100)).toBe(false);
  });

  test("반응을 취소하면 저장된 선택을 제거한다", () => {
    setStoredPostReaction(10, 100, true);
    setStoredPostReaction(10, 100, null);

    expect(getStoredPostReaction(10, 100)).toBeNull();
  });

  test("손상된 저장값이 있어도 선택 없음으로 처리한다", () => {
    window.localStorage.setItem(
      "algoga-community-post-reactions",
      "invalid-json"
    );

    expect(getStoredPostReaction(10, 100)).toBeNull();
  });

  test("댓글 반응을 사용자별로 저장하고 복원한다", () => {
    setStoredCommentReaction(10, 300, true);
    setStoredCommentReaction(10, 301, false);
    setStoredCommentReaction(11, 300, false);

    expect(getStoredCommentReactions(10)).toEqual({
      300: true,
      301: false,
    });
    expect(getStoredCommentReactions(11)).toEqual({ 300: false });
  });

  test("댓글 반응 취소 시 저장값을 제거한다", () => {
    setStoredCommentReaction(10, 300, true);
    setStoredCommentReaction(10, 300, null);

    expect(getStoredCommentReactions(10)).toEqual({});
  });
});
