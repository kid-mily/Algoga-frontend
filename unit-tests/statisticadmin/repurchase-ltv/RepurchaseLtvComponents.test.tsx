import { fireEvent, render, screen } from "@testing-library/react";
import CohortRetentionHeatmap from "@/features/statisticadmin/repurchase-ltv/components/CohortRetentionHeatmap";
import RepurchaseLtvSummaryCards from "@/features/statisticadmin/repurchase-ltv/components/RepurchaseLtvSummaryCards";
import TopCustomerTable from "@/features/statisticadmin/repurchase-ltv/components/TopCustomerTable";

describe("재구매·LTV 컴포넌트 테스트", () => {
  test("요약 카드에 주요 지표를 표시한다", () => {
    render(<RepurchaseLtvSummaryCards summary={{ repurchaseRate: 32.5, arpu: 450_000, averagePurchaseIntervalDays: 42, topCustomerRevenueShare: 61.3 }} />);

    expect(screen.getByText("재구매율")).toBeVisible();
    expect(screen.getByText("32.5%")).toBeVisible();
    expect(screen.getByText("ARPU")).toBeVisible();
    expect(screen.getByText("450,000원")).toBeVisible();
    expect(screen.getByText("42일")).toBeVisible();
    expect(screen.getByText("61.3%")).toBeVisible();
  });

  test("상위 고객 데이터와 CSV 버튼을 표시한다", () => {
    const onDownloadCsv = jest.fn();
    render(<TopCustomerTable data={[{ rank: 1, name: "홍길동", bookingCount: 7, cumulativePayment: 3_500_000, recentDestination: "일본", averagePurchaseIntervalDays: 30 }]} onDownloadCsv={onDownloadCsv} />);

    expect(screen.getByText("#1")).toBeVisible();
    expect(screen.getByText("홍길동")).toBeVisible();
    expect(screen.getByText("7회")).toBeVisible();
    expect(screen.getByText("3,500,000원")).toBeVisible();
    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("30일")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "CSV" }));
    expect(onDownloadCsv).toHaveBeenCalledTimes(1);
  });

  test("상위 고객 데이터가 없으면 빈 상태를 표시한다", () => {
    render(<TopCustomerTable data={[]} onDownloadCsv={jest.fn()} />);
    expect(screen.getByText("조회된 고객 데이터가 없습니다.")).toBeVisible();
  });

  test("코호트 월 헤더와 재구매율 및 미도래 값을 표시한다", () => {
    render(<CohortRetentionHeatmap maxMonths={3} data={[{ cohortMonth: "2026-05", cohortSize: 100, retentionRate: [100, 45, null], cumulativeRevenue: [10_000_000, 14_000_000, null] }]} />);

    expect(screen.getByText("M0")).toBeVisible();
    expect(screen.getByText("M1")).toBeVisible();
    expect(screen.getByText("M2")).toBeVisible();
    expect(screen.getByText("2026-05")).toBeVisible();
    expect(screen.getByText("100%")).toBeVisible();
    expect(screen.getByText("45%")).toBeVisible();
    expect(screen.getByText("-")).toBeVisible();
  });

  test("코호트 값에 맞는 배경색 클래스를 적용한다", () => {
    render(<CohortRetentionHeatmap maxMonths={4} data={[{ cohortMonth: "2026-05", cohortSize: 100, retentionRate: [80, 40, 25, 10], cumulativeRevenue: [] }]} />);

    expect(screen.getByText("80%")).toHaveClass("bg-[#1BA88F]");
    expect(screen.getByText("40%")).toHaveClass("bg-[#32B89F]");
    expect(screen.getByText("25%")).toHaveClass("bg-[#67CDBA]");
    expect(screen.getByText("10%")).toHaveClass("bg-[#B9E4DD]");
  });
});
