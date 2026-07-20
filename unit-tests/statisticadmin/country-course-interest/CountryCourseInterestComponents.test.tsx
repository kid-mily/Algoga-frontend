import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountryCourseInterestSummaryCards from "@/features/statisticadmin/country-course-interest/components/CountryCourseInterestSummaryCards";
import CountryDetailStatsTable from "@/features/statisticadmin/country-course-interest/components/CountryDetailStatsTable";
import CourseCompletionAnalysisTable from "@/features/statisticadmin/country-course-interest/components/CourseCompletionAnalysisTable";
import PopularCountryCourseRankingTable from "@/features/statisticadmin/country-course-interest/components/PopularCountryCourseRankingTable";
import type {
  CountryDetailStat,
  CourseCompletionStat,
  InterestSummary,
  PopularCountryCourseRank,
} from "@/features/statisticadmin/country-course-interest/types";
import { downloadInterestLecturesCsv } from "@/features/services/adminInterestStatistics.service";

jest.mock("@/features/services/adminInterestStatistics.service", () => ({
  downloadInterestLecturesCsv: jest.fn(),
}));

const summary: InterestSummary = {
  totalEnrollmentCount: 12648,
  averageCompletionRate: 50,
  riskyCourseCount: 5,
};

const countryDetails: CountryDetailStat[] = [
  {
    rank: 1,
    countryName: "일본",
    bookingCount: 3241,
    grossRevenue: 842_400_000,
    netRevenue: 810_000_000,
    refundRate: 3.8,
    balanceConversionRate: 91.2,
    cancelRate: 2.1,
    share: 28.4,
  },
];

const courseCompletions: CourseCompletionStat[] = [
  {
    courseId: 1,
    courseTitle: "도쿄 완전 정복 2024",
    enrollmentCount: 1842,
    averageProgressRate: 72,
    completionRate: 64.2,
    averageLearningHours: 3.5,
    completionStatus: "NORMAL",
  },
  {
    courseId: 2,
    courseTitle: "파리 완전 정복 2024",
    enrollmentCount: 1324,
    averageProgressRate: 68,
    completionRate: 58.7,
    averageLearningHours: 2.8,
    completionStatus: "WARNING",
  },
  {
    courseId: 3,
    courseTitle: "인도 문화 기행",
    enrollmentCount: 198,
    averageProgressRate: 38,
    completionRate: 17.8,
    averageLearningHours: 1.2,
    completionStatus: "RISK",
  },
];

const popularCourses: PopularCountryCourseRank[] = [
  {
    rank: 1,
    courseTitle: "도쿄 완전 정복 2024",
    countryName: "일본",
    enrollmentCount: 1842,
    averageProgressRate: 72,
    completionRate: 64.2,
    completionStatus: "NORMAL",
  },
  {
    rank: 2,
    courseTitle: "파리 완전 정복 2024",
    countryName: "프랑스",
    enrollmentCount: 1324,
    averageProgressRate: 68,
    completionRate: 58.7,
    completionStatus: "WARNING",
  },
];

describe("나라/강의별 관심도 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("요약 카드에 관심도 지표가 표시된다", () => {
    render(<CountryCourseInterestSummaryCards summary={summary} />);

    expect(screen.getByText("총 수강 건수")).toBeVisible();
    expect(screen.getByText("12,648건")).toBeVisible();
    expect(screen.getByText("평균 수료율")).toBeVisible();
    expect(screen.getByText("50%")).toBeVisible();
    expect(screen.getByText("수료율 위험 강의")).toBeVisible();
    expect(screen.getByText("5개")).toBeVisible();
  });

  test("국가별 상세 통계 표와 CSV 버튼이 동작한다", async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    const onDownloadCsv = jest.fn();

    render(
      <CountryDetailStatsTable
        data={countryDetails}
        search=""
        onSearchChange={onSearchChange}
        onDownloadCsv={onDownloadCsv}
      />
    );

    expect(screen.getByText("국가별 상세 통계")).toBeVisible();
    expect(screen.getByText("#1")).toBeVisible();
    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("3,241")).toBeVisible();
    expect(screen.getByText("842,400,000원")).toBeVisible();
    expect(screen.getByText("810,000,000원")).toBeVisible();
    expect(screen.getByText("91.2%")).toBeVisible();
    expect(screen.getByText("28.4%")).toBeVisible();

    await user.type(screen.getByLabelText("국가명 검색"), "일본");
    expect(onSearchChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /CSV/ }));
    expect(onDownloadCsv).toHaveBeenCalledTimes(1);
  });

  test("국가별 상세 통계의 로딩과 빈 상태를 보여준다", () => {
    const { rerender } = render(
      <CountryDetailStatsTable
        data={[]}
        search=""
        onSearchChange={jest.fn()}
        onDownloadCsv={jest.fn()}
        isLoading
      />
    );

    expect(screen.getByText("국가별 상세 통계를 불러오는 중입니다...")).toBeVisible();

    rerender(
      <CountryDetailStatsTable
        data={[]}
        search=""
        onSearchChange={jest.fn()}
        onDownloadCsv={jest.fn()}
      />
    );

    expect(screen.getByText("조회된 국가별 상세 통계가 없습니다.")).toBeVisible();
  });

  test("강의별 수강 현황에서 상태 배지와 검색, CSV 버튼을 확인한다", async () => {
    const user = userEvent.setup();
    const onKeywordChange = jest.fn();

    render(
      <CourseCompletionAnalysisTable
        data={courseCompletions}
        keyword=""
        onKeywordChange={onKeywordChange}
      />
    );

    expect(screen.getByText("강의별 수강률 분석")).toBeVisible();
    expect(screen.getByText("도쿄 완전 정복 2024")).toBeVisible();
    expect(screen.getByText("1,842명")).toBeVisible();
    expect(screen.getByText("72%")).toBeVisible();
    expect(screen.getByText("64.2%")).toBeVisible();
    expect(screen.getByText("주의")).toBeVisible();
    expect(screen.getByText("점검필요")).toBeVisible();

    await user.type(screen.getByLabelText("강의명 검색"), "도쿄");
    expect(onKeywordChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /CSV/ }));
    expect(downloadInterestLecturesCsv).toHaveBeenCalledWith("");
  });

  test("인기 국가 강의 순위 표를 렌더링한다", async () => {
    const user = userEvent.setup();
    const onKeywordChange = jest.fn();

    render(
      <PopularCountryCourseRankingTable
        data={popularCourses}
        keyword=""
        onKeywordChange={onKeywordChange}
      />
    );

    expect(screen.getByText("인기 국가 강의 순위")).toBeVisible();
    expect(screen.getByText("수강자 수 기준 정렬")).toBeVisible();
    expect(screen.getByText("#1")).toBeVisible();
    expect(screen.getByText("도쿄 완전 정복 2024")).toBeVisible();
    expect(screen.getByText("프랑스")).toBeVisible();
    expect(screen.getByText("58.7%")).toBeVisible();
    expect(screen.getByText("주의")).toBeVisible();

    await user.type(screen.getByLabelText("강의명 나라 검색"), "파리");
    expect(onKeywordChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /CSV/ }));
    expect(downloadInterestLecturesCsv).toHaveBeenCalledWith("");
  });
});
