import {
  emptyNoticeForm,
  getNoticeTagLabel,
  isNoticeTag,
  noticeFilterOptions,
  noticeTagOptions,
} from "@/features/csadmin/notice/types";

describe("CS매니저 공지사항 타입 유틸 테스트", () => {
  test("공지사항 태그 옵션과 필터 옵션을 제공한다", () => {
    expect(noticeTagOptions).toEqual([
      { value: "NOTICE", label: "공지" },
      { value: "EVENT", label: "이벤트" },
      { value: "MAINTENANCE", label: "점검" },
    ]);
    expect(noticeFilterOptions).toEqual([
      { value: "ALL", label: "전체" },
      ...noticeTagOptions,
    ]);
  });

  test("isNoticeTag는 허용된 태그만 true를 반환한다", () => {
    expect(isNoticeTag("ALL")).toBe(true);
    expect(isNoticeTag("NOTICE")).toBe(true);
    expect(isNoticeTag("EVENT")).toBe(true);
    expect(isNoticeTag("MAINTENANCE")).toBe(true);
    expect(isNoticeTag("UNKNOWN")).toBe(false);
  });

  test("getNoticeTagLabel은 태그 표시명을 반환하고 모르는 태그는 원본을 반환한다", () => {
    expect(getNoticeTagLabel("NOTICE")).toBe("공지");
    expect(getNoticeTagLabel("EVENT")).toBe("이벤트");
    expect(getNoticeTagLabel("MAINTENANCE")).toBe("점검");
    expect(getNoticeTagLabel("CUSTOM")).toBe("CUSTOM");
  });

  test("emptyNoticeForm은 공지 등록 기본값을 가진다", () => {
    expect(emptyNoticeForm).toEqual({
      title: "",
      content: "",
      tag: "NOTICE",
    });
  });
});
