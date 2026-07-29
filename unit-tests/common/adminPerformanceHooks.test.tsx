import { renderHook, waitFor } from "@testing-library/react";

import { useAdminPackageList } from "@/features/contentmanage/package/hooks/useAdminPackageList";
import { useAdminRagSourceStats } from "@/features/csadmin/chatbot/hooks/useAdminRagSourceStats";
import { useCountryCourseInterestStatistics } from "@/features/statisticadmin/country-course-interest/hooks/useCountryCourseInterestStatistics";
import {
  getAdminPackages,
  getCountryAccommodations,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getAdminRagSourceStats } from "@/features/services/adminChatbot.service";
import {
  getCountryProfitList,
  getInterestCountries,
  getInterestLectures,
  getInterestSummary,
} from "@/features/services/adminInterestStatistics.service";

jest.mock("@/features/services/adminPackage.service", () => ({
  deleteAdminPackage: jest.fn(),
  getAdminPackages: jest.fn(),
  getCountryAccommodations: jest.fn(),
}));

jest.mock("@/features/services/adminCourse.service", () => ({
  getCourseCountries: jest.fn(),
}));

jest.mock("@/features/services/adminChatbot.service", () => ({
  getAdminRagSourceStats: jest.fn(),
}));

jest.mock("@/features/services/adminInterestStatistics.service", () => ({
  getCountryProfitList: jest.fn(),
  getInterestCountries: jest.fn(),
  getInterestLectures: jest.fn(),
  getInterestSummary: jest.fn(),
}));

describe("관리자 프론트 요청 최적화", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("패키지 응답에 이름이 있으면 국가·숙소 보충 조회를 생략한다", async () => {
    (getAdminPackages as jest.Mock).mockResolvedValue([
      {
        packageId: 1,
        name: "도쿄 패키지",
        countryId: 1,
        countryName: "일본",
        accommodationId: 10,
        accommodationName: "도쿄 호텔",
      },
    ]);

    const { result } = renderHook(() => useAdminPackageList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getCourseCountries).not.toHaveBeenCalled();
    expect(getCountryAccommodations).not.toHaveBeenCalled();
  });

  test("RAG 통계 첫 페이지 응답을 표와 TOP 10이 공유한다", async () => {
    (getAdminRagSourceStats as jest.Mock).mockResolvedValue({
      content: [
        {
          sourceId: 1,
          sourceType: "COURSE",
          sourceName: "일본 강의",
          count: 10,
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    });

    const { result } = renderHook(() => useAdminRagSourceStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAdminRagSourceStats).toHaveBeenCalledTimes(1);
    expect(result.current.topStats).toHaveLength(1);
  });

  test("통계 초기 강의 목록 응답을 수강 현황과 인기 순위가 공유한다", async () => {
    const lectures = [
      {
        rank: 1,
        courseTitle: "일본 여행 강의",
        countryName: "일본",
        enrollmentCount: 20,
        averageProgressRate: 60,
        completionRate: 50,
        completionStatus: "NORMAL",
      },
    ];

    (getInterestSummary as jest.Mock).mockResolvedValue({
      totalEnrollmentCount: 20,
      averageCompletionRate: 50,
      riskyCourseCount: 0,
    });
    (getInterestCountries as jest.Mock).mockResolvedValue([]);
    (getInterestLectures as jest.Mock).mockResolvedValue(lectures);
    (getCountryProfitList as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() =>
      useCountryCourseInterestStatistics()
    );

    await waitFor(() => {
      expect(result.current.popularCourseRanks).toHaveLength(1);
      expect(result.current.courseCompletions).toHaveLength(1);
    });

    expect(getInterestLectures).toHaveBeenCalledTimes(1);
    expect(getInterestLectures).toHaveBeenCalledWith(
      "",
      expect.any(AbortSignal)
    );
  });
});
