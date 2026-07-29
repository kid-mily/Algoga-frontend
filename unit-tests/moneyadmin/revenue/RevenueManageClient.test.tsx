import { render, screen } from "@testing-library/react";
import RevenueManageClient from "@/features/moneyadmin/revenue/components/RevenueManageClient";
import { useRevenueStats } from "@/features/moneyadmin/revenue/hooks/useRevenueStats";
import type { MonthlyRevenueStat } from "@/features/moneyadmin/revenue/types";

jest.mock("@/features/moneyadmin/revenue/hooks/useRevenueStats", () => ({
  useRevenueStats: jest.fn(),
}));

const stats: MonthlyRevenueStat[] = [
  {
    year: 2026,
    month: 6,
    totalAmount: 1800000,
    refundAmount: 200000,
    netAmount: 1600000,
    count: 8,
    growthRate: -4.2,
  },
  {
    year: 2026,
    month: 7,
    totalAmount: 2500000,
    refundAmount: 300000,
    netAmount: 2200000,
    count: 12,
    growthRate: 12.5,
  },
];

const createHookValue = (override = {}) => ({
  stats,
  latestStat: stats[1],
  totalNetAmount: 3800000,
  isLoading: false,
  error: "",
  ...override,
});

describe("RevenueManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRevenueStats as jest.Mock).mockReturnValue(createHookValue());
  });

  test("월별 수익 요약 카드와 목록을 렌더링한다", () => {
    render(<RevenueManageClient />);

    expect(screen.getByText("월별 수익 조회")).toBeVisible();
    expect(screen.getByText("조회 월 2개 | 누적 순수익 3,800,000원")).toBeVisible();
    expect(screen.getAllByText("총 매출")[0]).toBeVisible();
    expect(screen.getAllByText("환불 금액")[0]).toBeVisible();
    expect(screen.getAllByText("2,500,000원")[0]).toBeVisible();
    expect(screen.getAllByText("300,000원")[0]).toBeVisible();
    expect(screen.getAllByText("2,200,000원")[0]).toBeVisible();
    expect(screen.getByText("2026.07")).toBeVisible();
    expect(screen.getAllByRole("link", { name: "상세 보기" })[1]).toHaveAttribute(
      "href",
      "/moneyadmin/revenue/2026/7"
    );
  });

  test("로딩 중이면 월별 수익 통계 로딩 문구를 보여준다", () => {
    (useRevenueStats as jest.Mock).mockReturnValue(
      createHookValue({
        stats: [],
        latestStat: undefined,
        totalNetAmount: 0,
        isLoading: true,
      })
    );

    render(<RevenueManageClient />);

    expect(screen.getByText("월별 수익 통계를 불러오는 중입니다...")).toBeVisible();
  });

  test("에러가 있으면 에러 배너를 보여준다", () => {
    (useRevenueStats as jest.Mock).mockReturnValue(
      createHookValue({
        stats: [],
        latestStat: undefined,
        totalNetAmount: 0,
        error: "월별 수익 조회 실패",
      })
    );

    render(<RevenueManageClient />);

    expect(screen.getByText("월별 수익 조회 실패")).toBeVisible();
  });

  test("조회된 통계가 없으면 빈 상태 문구를 보여준다", () => {
    (useRevenueStats as jest.Mock).mockReturnValue(
      createHookValue({
        stats: [],
        latestStat: undefined,
        totalNetAmount: 0,
      })
    );

    render(<RevenueManageClient />);

    expect(screen.getByText("조회된 월별 수익 통계가 없습니다.")).toBeVisible();
  });
});
