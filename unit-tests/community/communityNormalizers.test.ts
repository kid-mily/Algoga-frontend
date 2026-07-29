import {
  normalizeComment,
  normalizeContinent,
  normalizeCountry,
  normalizeFilter,
  normalizePost,
  normalizeReactionResult,
  toCommentList,
} from "@/features/community/utils/communityNormalizers";

describe("커뮤니티 데이터 정규화 단위 테스트", () => {
  test("대륙 정보가 정상이면 정규화된 대륙을 반환한다", () => {
    const result = normalizeContinent({ continentCode: "ASIA", continentName: "아시아" });

    expect(result).toEqual({ continentCode: "ASIA", continentName: "아시아" });
  });

  test("대륙명이 없으면 null을 반환한다", () => {
    const result = normalizeContinent({ continentCode: "ASIA" });

    expect(result).toBeNull();
  });

  test("국가 정보가 정상이면 정규화된 국가를 반환한다", () => {
    const result = normalizeCountry({
      countryId: 1,
      countryName: "일본",
      countryCode: "JP",
      continentCode: "ASIA",
    });

    expect(result).toEqual({
      countryId: 1,
      countryName: "일본",
      countryCode: "JP",
      continentCode: "ASIA",
    });
  });

  test("국가 ID가 0 이하이면 null을 반환한다", () => {
    const result = normalizeCountry({ countryId: 0, countryName: "일본" });

    expect(result).toBeNull();
  });

  test("국가 태그는 country- 접두사가 붙은 필터로 정규화된다", () => {
    const result = normalizeFilter({ tagType: "COUNTRY", tagName: "일본", countryId: 5 });

    expect(result).toEqual({
      id: "country-5",
      tagType: "COUNTRY",
      tagName: "일본",
      countryId: 5,
    });
  });

  test("카테고리 태그는 대문자로 정규화되어 필터가 만들어진다", () => {
    const result = normalizeFilter({ tagType: "question", tagName: "질문 모음" });

    expect(result).toEqual({
      id: "QUESTION",
      tagType: "CATEGORY",
      tagName: "질문 모음",
      category: "QUESTION",
    });
  });

  test("카테고리 태그명이 없으면 기본 라벨을 사용한다", () => {
    const result = normalizeFilter({ tagType: "free" });

    expect(result).toEqual({
      id: "FREE",
      tagType: "CATEGORY",
      tagName: "자유",
      category: "FREE",
    });
  });

  test("알 수 없는 태그 타입이면 null을 반환한다", () => {
    const result = normalizeFilter({ tagType: "UNKNOWN" });

    expect(result).toBeNull();
  });

  test("댓글 정보가 정상이면 정규화된 댓글을 반환한다", () => {
    const result = normalizeComment({
      commentId: 10,
      parentId: 0,
      nickname: "여행자",
      content: "좋은 정보 감사합니다.",
      likeCount: 3,
      dislikeCount: 0,
      isMine: true,
      replies: [],
    });

    expect(result).toEqual({
      commentId: 10,
      parentId: null,
      authorId: undefined,
      authorName: "여행자",
      authorInitial: "여",
      authorProfileImageUrl: null,
      createdAt: "",
      content: "좋은 정보 감사합니다.",
      likeCount: 3,
      dislikeCount: 0,
      isMine: true,
      replies: [],
    });
  });

  test("댓글 작성자 닉네임이 없으면 익명으로 처리된다", () => {
    const result = normalizeComment({ commentId: 1, content: "내용" });

    expect(result?.authorName).toBe("익명");
    expect(result?.authorInitial).toBe("익");
  });

  test("댓글 ID가 0 이하이면 null을 반환한다", () => {
    const result = normalizeComment({ commentId: 0, content: "내용" });

    expect(result).toBeNull();
  });

  test("대댓글은 재귀적으로 정규화된다", () => {
    const result = normalizeComment({
      commentId: 1,
      content: "부모 댓글",
      replies: [
        { commentId: 2, parentId: 1, content: "대댓글" },
        { commentId: 0, content: "잘못된 대댓글" },
      ],
    });

    expect(result?.replies).toHaveLength(1);
    expect(result?.replies[0]).toMatchObject({ commentId: 2, parentId: 1, content: "대댓글" });
  });

  test("toCommentList는 유효한 댓글만 배열로 변환한다", () => {
    const result = toCommentList([
      { commentId: 1, content: "댓글1" },
      { commentId: 0, content: "무효한 댓글" },
      null,
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].commentId).toBe(1);
  });

  test("toCommentList는 배열이 아니면 빈 배열을 반환한다", () => {
    expect(toCommentList(undefined)).toEqual([]);
  });

  test("게시글 정보가 정상이면 정규화된 게시글을 반환한다", () => {
    const result = normalizePost({
      postId: 1,
      title: "오사카 여행 후기",
      content: "정말 좋았어요",
      authorNickname: "여행자",
      countryId: 1,
      countryName: "일본",
      tags: [
        { tagType: "QUESTION", tagName: "질문" },
        { tagType: "FREE", tagName: "커스텀태그" },
      ],
      imageUrls: ["https://example.com/1.jpg"],
      likeCount: 2,
      dislikeCount: 1,
      commentCount: 3,
      viewCount: 10,
      isMine: false,
      comments: [],
    });

    expect(result).toMatchObject({
      postId: 1,
      title: "오사카 여행 후기",
      content: "정말 좋았어요",
      authorName: "여행자",
      authorInitial: "여",
      country: "일본",
      category: "질문",
      categoryCode: "QUESTION",
      imageUrl: "https://example.com/1.jpg",
      imageUrls: ["https://example.com/1.jpg"],
      imageTotal: 1,
      likeCount: 2,
      dislikeCount: 1,
      commentCount: 3,
      viewCount: 10,
      isMine: false,
    });
  });

  test("제목이 없으면 null을 반환한다", () => {
    const result = normalizePost({ postId: 1, title: "" });

    expect(result).toBeNull();
  });

  test("게시글 ID가 0 이하이면 null을 반환한다", () => {
    const result = normalizePost({ postId: 0, title: "제목" });

    expect(result).toBeNull();
  });

  test("카테고리 태그가 없으면 자유로 분류되고 국가/작성자는 기본값을 사용한다", () => {
    const result = normalizePost({ postId: 1, title: "제목", content: "내용" });

    expect(result).toMatchObject({
      category: "자유",
      country: "여행",
      authorName: "익명",
      imageUrl: null,
      imageUrls: [],
      imageTotal: 0,
    });
  });

  test("이미지가 없고 썸네일만 있으면 썸네일을 이미지로 사용한다", () => {
    const result = normalizePost({
      postId: 1,
      title: "제목",
      content: "내용",
      thumbnailUrl: "https://example.com/thumb.jpg",
    });

    expect(result?.imageUrls).toEqual(["https://example.com/thumb.jpg"]);
    expect(result?.imageUrl).toBe("https://example.com/thumb.jpg");
  });

  test("응답이 data로 감싸져 있으면 내부 데이터를 반환한다", () => {
    const result = normalizeReactionResult({
      data: { status: "REMOVED", likeCount: 3, dislikeCount: 1 },
    });

    expect(result).toEqual({ status: "REMOVED", likeCount: 3, dislikeCount: 1 });
  });

  test("응답이 data로 감싸져 있지 않으면 응답 자체를 사용한다", () => {
    const result = normalizeReactionResult({
      status: "CHANGED",
      likeCount: 5,
      dislikeCount: 2,
    });

    expect(result).toEqual({ status: "CHANGED", likeCount: 5, dislikeCount: 2 });
  });

  test("응답이 비어있으면 기본값을 반환한다", () => {
    const result = normalizeReactionResult({});

    expect(result).toEqual({ status: "ADDED", likeCount: 0, dislikeCount: 0 });
  });
});
