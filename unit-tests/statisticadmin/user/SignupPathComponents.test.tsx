import { render, screen } from "@testing-library/react";
import SignupPathSummaryCards from "@/features/statisticadmin/user/components/SignupPathSummaryCards";
import SignupPathTable from "@/features/statisticadmin/user/components/SignupPathTable";
import type {
  SignupPathChannelRevenue,
  SignupPathSummary,
} from "@/features/statisticadmin/user/types";

const summary: SignupPathSummary = {
  totalSignupCount: 5460,
  totalNetSales: 726_000_000,
  bestEfficiencyPathLabel: "추천",
  bestEfficiencyPathArpu: 158_065,
};

const channelRevenue: SignupPathChannelRevenue[] = [
  {
    signupPath: "SEARCH",
    label: "검색 엔진",
    signupCount: 1250,
    ratio: 43,
    netSales: 86_400_000,
    arpu: 69_120,
    bookingCount: 320,
    bookingConversionRate: 25.6,
    color: "#439A97",
  },
  {
    signupPath: "SOCIAL",
    label: "소셜 미디어",
    signupCount: 780,
    ratio: 27,
    netSales: 54_300_000,
    arpu: 69_615,
    bookingCount: 140,
    bookingConversionRate: 17.9,
    color: "#D4529C",
  },
];

describe("유입경로별 전환 컴포넌트 테스트", () => {
  test("요약 카드에 가입자 수, 순매출, 최고 효율 경로가 표시된다", () => {
    render(<SignupPathSummaryCards summary={summary} />);

    expect(screen.getByLabelText("유저 유입 경로 요약")).toBeVisible();
    expect(screen.getByText("총가입자 수")).toBeVisible();
    expect(screen.getByText("5,460명")).toBeVisible();
    expect(screen.getByText("총 순매출")).toBeVisible();
    expect(screen.getByText("7.3억원")).toBeVisible();
    expect(screen.getByText("최고 효율 경로")).toBeVisible();
    expect(screen.getByText("추천 · 15.8만원")).toBeVisible();
  });

  test("유입 경로별 상세통계를 렌더링한다", () => {
    render(
      <SignupPathTable channelRevenue={channelRevenue} isLoading={false} />
    );

    expect(screen.getByText("유저 경로별 상세통계")).toBeVisible();
    expect(screen.getByText("검색 엔진")).toBeVisible();
    expect(screen.getByText("1,250명")).toBeVisible();
    expect(screen.getByText("8640만원")).toBeVisible();
    expect(screen.getByText("320건")).toBeVisible();
    expect(screen.getByText("25.6%")).toBeVisible();
    expect(screen.getByText("소셜 미디어")).toBeVisible();
    expect(screen.getByText("5430만원")).toBeVisible();
  });

  test("로딩과 빈 상태 문구를 보여준다", () => {
    const { rerender } = render(
      <SignupPathTable channelRevenue={[]} isLoading />
    );

    expect(screen.getByText("유입 경로 통계를 불러오는 중입니다...")).toBeVisible();

    rerender(<SignupPathTable channelRevenue={[]} isLoading={false} />);

    expect(screen.getByText("유입 경로 통계 데이터가 없습니다.")).toBeVisible();
  });
});
