import {
  ALL_TIME_QUERY,
  getCouponConversionData,
} from "@/features/services/adminCouponConversionStatistics.service";
import { adminApi } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  adminApi: { get: jest.fn() },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response && typeof response === "object" && "data" in response
      ? response.data
      : response,
}));

describe("쿠폰 → 예약 전환 서비스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("쿠폰 통계를 요약하고 같은 강의의 정책을 합산한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          totalPolicyCount: 3,
          totalIssuedCouponCount: 250,
          totalUsedCouponCount: 90,
          totalExpiredCouponCount: 30,
          totalAvailableCouponCount: 130,
          policies: [
            { couponPolicyId: 1, couponName: "봄 할인", courseId: 10, courseTitle: "일본 여행", issuedCount: 100, usedCount: 40, expiredCount: 10, availableCount: 50 },
            { couponPolicyId: 2, couponName: "여름 할인", courseId: 10, courseTitle: "일본 여행", issuedCount: 50, usedCount: 20, expiredCount: 5, availableCount: 25 },
            { couponPolicyId: 3, couponName: "신규 할인", courseId: 20, courseTitle: "프랑스 여행", issuedCount: 100, usedCount: 30, expiredCount: 15, availableCount: 55 },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: { couponUsedUsers: 90, convertedUsers: 18, conversionRate: 20 },
      })
      .mockResolvedValueOnce({ data: [] });

    const result = await getCouponConversionData();

    expect(result.summary).toEqual({
      issuedCount: 250,
      usedCount: 90,
      usageRate: 36,
      availableCount: 130,
      reservationConversionRate: 20,
    });
    expect(result.performance).toEqual([
      expect.objectContaining({ couponName: "봄 할인", usageRate: 40 }),
      expect.objectContaining({ couponName: "여름 할인", usageRate: 40 }),
      expect.objectContaining({ couponName: "신규 할인", usageRate: 30 }),
    ]);
    expect(result.lectureUsage).toEqual([
      { lectureTitle: "일본 여행", usageRate: 40 },
      { lectureTitle: "프랑스 여행", usageRate: 30 },
    ]);
  });

  test("세 데이터 소스에 전체 기간 조건을 일관되게 적용한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { policies: [] } })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: [] });

    await getCouponConversionData();

    expect(adminApi.get).toHaveBeenNthCalledWith(
      1,
      "/api/v1/admin/coupon-statistics",
      expect.objectContaining({ suppressGlobalError: true })
    );
    expect(adminApi.get).toHaveBeenNthCalledWith(
      2,
      "/api/v1/admin/stats/coupon/conversion",
      expect.objectContaining({ params: ALL_TIME_QUERY, suppressGlobalError: true })
    );
    expect(adminApi.get).toHaveBeenNthCalledWith(
      3,
      "/api/v1/admin/stats/lecture-to-trip/by-country",
      expect.objectContaining({ params: ALL_TIME_QUERY, suppressGlobalError: true })
    );
  });

  test("0으로 나누는 경우와 null 숫자 및 누락된 강의명을 안전하게 처리한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          totalIssuedCouponCount: null,
          totalUsedCouponCount: null,
          totalAvailableCouponCount: null,
          policies: [
            { couponPolicyId: 1, couponName: "빈 쿠폰", courseId: 1, courseTitle: "", issuedCount: 0, usedCount: null, expiredCount: 0, availableCount: 0 },
          ],
        },
      })
      .mockResolvedValueOnce({ data: { conversionRate: null } })
      .mockResolvedValueOnce({ data: [] });

    const result = await getCouponConversionData();

    expect(result.summary).toEqual({
      issuedCount: 0,
      usedCount: 0,
      usageRate: 0,
      availableCount: 0,
      reservationConversionRate: 0,
    });
    expect(result.performance[0]).toEqual(
      expect.objectContaining({ issuedCount: 0, usedCount: 0, usageRate: 0 })
    );
    expect(result.lectureUsage).toEqual([{ lectureTitle: "-", usageRate: 0 }]);
  });
});
