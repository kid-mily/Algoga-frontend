import {
  formatPrice,
  getIsPublic,
  getLectureCountryId,
  getLectureId,
} from "@/features/contentmanage/lecture/utils/lectureFormatters";

describe("lectureFormatters 단위 테스트", () => {
  test("getLectureId는 가능한 ID 필드 중 유효한 값을 반환한다", () => {
    expect(getLectureId({ courseId: 10 } as never)).toBe(10);
    expect(getLectureId({ course_id: 20 } as never)).toBe(20);
    expect(getLectureId({ id: 30 } as never)).toBe(30);
    expect(getLectureId({} as never)).toBe(0);
  });

  test("getLectureCountryId는 countryId 또는 country_id를 반환한다", () => {
    expect(getLectureCountryId({ countryId: 12 } as never)).toBe(12);
    expect(getLectureCountryId({ country_id: 13 } as never)).toBe(13);
    expect(getLectureCountryId({} as never)).toBe(0);
  });

  test("getIsPublic은 공개 상태 문자열을 boolean으로 변환한다", () => {
    expect(getIsPublic({ status: "PUBLISHED" } as never)).toBe(true);
    expect(getIsPublic({ status: "PUBLIC" } as never)).toBe(true);
    expect(getIsPublic({ status: "DRAFT" } as never)).toBe(false);
    expect(getIsPublic({ isPublic: true } as never)).toBe(true);
    expect(getIsPublic({ is_public: "true" } as never)).toBe(true);
    expect(getIsPublic({ public: "false" } as never)).toBe(false);
  });

  test("formatPrice는 금액을 원 단위 문자열로 변환한다", () => {
    expect(formatPrice(120000)).toBe("120,000원");
    expect(formatPrice()).toBe("-");
  });
});
