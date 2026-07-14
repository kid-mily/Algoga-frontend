import {
  filterCoupons,
  formatDate,
  formatDiscount,
  formatValidDays,
  getCouponCourseId,
  getCouponId,
  getCouponName,
  getIsCouponActive,
} from "@/features/contentmanage/coupon/utils/couponFormatters";
import type { CouponWithLecture } from "@/features/contentmanage/coupon/types";

const coupons: CouponWithLecture[] = [
  {
    couponPolicyId: 1,
    courseId: 12,
    managerId: 1,
    couponName: "수료 할인 쿠폰",
    percent: 10,
    validDays: 30,
    active: true,
    createdAt: "2026-07-14T00:00:00",
    updatedAt: "2026-07-14T00:00:00",
    lectureName: "오사카 여행 준비",
  },
  {
    couponPolicyId: 2,
    courseId: 13,
    managerId: 1,
    couponName: "비활성 쿠폰",
    percent: 20,
    validDays: 15,
    active: false,
    createdAt: "2026-07-13T00:00:00",
    updatedAt: "2026-07-13T00:00:00",
    lectureName: "도쿄 여행 준비",
  },
];

describe("couponFormatters 단위 테스트", () => {
  test("쿠폰의 기본 값을 가져온다", () => {
    expect(getCouponId(coupons[0])).toBe(1);
    expect(getCouponCourseId(coupons[0])).toBe(12);
    expect(getCouponName(coupons[0])).toBe("수료 할인 쿠폰");
    expect(getIsCouponActive(coupons[0])).toBe(true);
  });

  test("할인율과 유효기간을 화면 표시 형식으로 변환한다", () => {
    expect(formatDiscount(coupons[0])).toBe("10%");
    expect(formatValidDays(30)).toBe("30일");
    expect(formatValidDays()).toBe("-");
  });

  test("날짜는 앞의 yyyy-mm-dd 값만 사용한다", () => {
    expect(formatDate("2026-07-14T00:00:00")).toBe("2026-07-14");
    expect(formatDate()).toBe("-");
  });

  test("검색어로 쿠폰을 필터링한다", () => {
    const result = filterCoupons(coupons, "수료", "all");

    expect(result).toHaveLength(1);
    expect(result[0].couponName).toBe("수료 할인 쿠폰");
  });

  test("상태값으로 쿠폰을 필터링한다", () => {
    expect(filterCoupons(coupons, "", "active")).toHaveLength(1);
    expect(filterCoupons(coupons, "", "inactive")).toHaveLength(1);
    expect(filterCoupons(coupons, "", "all")).toHaveLength(2);
  });
});
