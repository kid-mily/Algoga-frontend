import {
  getCourseReservationConversionData,
  getLectureCountryConversion,
} from "@/features/services/adminLectureConversionStatistics.service";
import { adminApi } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  adminApi: { get: jest.fn() },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response && typeof response === "object" && "data" in response
      ? response.data
      : response,
}));

const query = { from: "2026-07-01", to: "2026-07-22" };

describe("강의 → 예약 전환 서비스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("세 통계 API를 같은 기간으로 호출하고 화면 모델로 변환한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          lectureBuyers: 100,
          completedCount: 80,
          completionRate: 80,
          convertedCount: 25,
          completedConversionRate: 31.3,
          notCompletedConversionRate: 5,
          vsNonCompletedMultiple: 6.3,
        },
      })
      .mockResolvedValueOnce({
        data: {
          top: [{ lectureId: 1, title: "일본 여행", buyers: 20, completed: 18, converted: 8, conversionRate: 40 }],
          bottom: [{ lectureId: 2, title: "프랑스 여행", buyers: 10, completed: 3, converted: 1, conversionRate: 10 }],
        },
      })
      .mockResolvedValueOnce({
        data: [
          { countryId: 1, countryName: "일본", buyers: 40, completed: 35, converted: 10, conversionRate: 25 },
          { countryId: 2, countryName: "프랑스", buyers: 20, completed: 10, converted: 2, conversionRate: 10 },
        ],
      });

    const result = await getCourseReservationConversionData(query);

    expect(adminApi.get).toHaveBeenCalledTimes(3);
    expect(adminApi.get).toHaveBeenNthCalledWith(
      1,
      "/api/v1/admin/stats/lecture-to-trip/summary",
      expect.objectContaining({ params: query, suppressGlobalError: true })
    );
    expect(adminApi.get).toHaveBeenNthCalledWith(
      2,
      "/api/v1/admin/stats/lecture-to-trip/by-lecture",
      expect.objectContaining({ params: query, suppressGlobalError: true })
    );
    expect(adminApi.get).toHaveBeenNthCalledWith(
      3,
      "/api/v1/admin/stats/lecture-to-trip/by-country",
      expect.objectContaining({ params: query, suppressGlobalError: true })
    );
    expect(result.summary).toEqual({
      totalLectureBuyers: 100,
      completionRate: 80,
      completedToReservationRate: 31.3,
      completedVsIncompleteMultiplier: 6.3,
    });
    expect(result.funnel).toEqual([
      expect.objectContaining({ key: "buyers", value: 100, percentage: 100 }),
      expect.objectContaining({ key: "completed", value: 80, percentage: 80 }),
      expect.objectContaining({ key: "reserved", value: 25, percentage: 25 }),
    ]);
    expect(result.topLectures).toEqual([{ lectureTitle: "일본 여행", conversionRate: 40 }]);
    expect(result.bottomLectures).toEqual([{ lectureTitle: "프랑스 여행", conversionRate: 10 }]);
    expect(result.countries).toEqual([
      expect.objectContaining({ country: "일본", evaluation: "우수" }),
      expect.objectContaining({ country: "프랑스", evaluation: "저조" }),
    ]);
  });

  test("구매자가 없거나 숫자 값이 null이면 0으로 안전하게 변환한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          lectureBuyers: null,
          completedCount: null,
          completionRate: null,
          convertedCount: null,
          completedConversionRate: null,
          notCompletedConversionRate: null,
          vsNonCompletedMultiple: null,
        },
      })
      .mockResolvedValueOnce({ data: { top: [], bottom: [] } })
      .mockResolvedValueOnce({ data: [] });

    const result = await getCourseReservationConversionData(query);

    expect(result.summary).toEqual({
      totalLectureBuyers: 0,
      completionRate: 0,
      completedToReservationRate: 0,
      completedVsIncompleteMultiplier: 0,
    });
    expect(result.funnel[2]).toEqual(
      expect.objectContaining({ value: 0, percentage: 0 })
    );
  });

  test("나라별 전환 조회는 평가 등급과 null 숫자 폴백을 적용한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [{ countryId: 1, countryName: "태국", buyers: null, completed: null, converted: null, conversionRate: 20 }],
    });

    await expect(getLectureCountryConversion(query)).resolves.toEqual([
      {
        country: "태국",
        lectureBuyers: 0,
        completedUsers: 0,
        reservationUsers: 0,
        conversionRate: 20,
        evaluation: "보통",
      },
    ]);
  });
});
