import {
  createCommunityPostFormData,
  createCommunityPostUpdateFormData,
} from "@/features/community/utils/communityFormData";

describe("커뮤니티 게시글 FormData 변환 단위 테스트", () => {
  test("필수 값만 전달하면 제목/내용/카테고리만 담긴 FormData를 만든다", () => {
    const formData = createCommunityPostFormData({
      title: "오사카 여행 후기",
      content: "정말 좋았어요",
      tagType: "TRAVEL_REVIEW",
    });

    expect(formData.get("title")).toBe("오사카 여행 후기");
    expect(formData.get("content")).toBe("정말 좋았어요");
    expect(formData.get("category")).toBe("TRAVEL_REVIEW");
    expect(formData.get("countryId")).toBeNull();
    expect(formData.getAll("freeTags")).toEqual([]);
    expect(formData.getAll("images")).toEqual([]);
  });

  test("countryId가 있으면 문자열로 변환되어 담긴다", () => {
    const formData = createCommunityPostFormData({
      title: "제목",
      content: "내용",
      countryId: 1,
      tagType: "TRAVEL_REVIEW",
    });

    expect(formData.get("countryId")).toBe("1");
  });

  test("countryId가 0이면 담기지 않는다", () => {
    const formData = createCommunityPostFormData({
      title: "제목",
      content: "내용",
      countryId: 0,
      tagType: "TRAVEL_REVIEW",
    });

    expect(formData.get("countryId")).toBeNull();
  });

  test("customTags는 freeTags로 각각 담긴다", () => {
    const formData = createCommunityPostFormData({
      title: "제목",
      content: "내용",
      tagType: "FREE",
      customTags: ["혼자여행", "국내여행"],
    });

    expect(formData.getAll("freeTags")).toEqual(["혼자여행", "국내여행"]);
  });

  test("images는 images 키로 각각 담긴다", () => {
    const image1 = new File(["a"], "a.png", { type: "image/png" });
    const image2 = new File(["b"], "b.png", { type: "image/png" });

    const formData = createCommunityPostFormData({
      title: "제목",
      content: "내용",
      tagType: "TRAVEL_REVIEW",
      images: [image1, image2],
    });

    expect(formData.getAll("images")).toEqual([image1, image2]);
  });

  test("수정용 FormData는 기존/삭제 이미지 URL도 함께 담는다", () => {
    const formData = createCommunityPostUpdateFormData({
      postId: 1,
      title: "제목",
      content: "내용",
      tagType: "TRAVEL_REVIEW",
      existingImageUrls: ["https://example.com/1.jpg"],
      deletedImageUrls: ["https://example.com/2.jpg"],
    });

    expect(formData.get("title")).toBe("제목");
    expect(formData.getAll("existingImageUrls")).toEqual(["https://example.com/1.jpg"]);
    expect(formData.getAll("deletedImageUrls")).toEqual(["https://example.com/2.jpg"]);
  });

  test("수정용 FormData에서 기존/삭제 이미지 URL이 없으면 빈 배열로 처리된다", () => {
    const formData = createCommunityPostUpdateFormData({
      postId: 1,
      title: "제목",
      content: "내용",
      tagType: "TRAVEL_REVIEW",
    });

    expect(formData.getAll("existingImageUrls")).toEqual([]);
    expect(formData.getAll("deletedImageUrls")).toEqual([]);
  });
});
