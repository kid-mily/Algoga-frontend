import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SalesOverviewSummaryCards from "@/features/statisticadmin/finances/components/SalesOverviewSummaryCards";
import SalesOverviewTable from "@/features/statisticadmin/finances/components/SalesOverviewTable";
import type {
  SalesOverviewMonthlyStat,
  SalesOverviewSummary,
} from "@/features/statisticadmin/finances/types";

const summary: SalesOverviewSummary = {
  netSales: 2_340_000_000,
  receivableAmount: 84_500_000,
  refundRate: 4.8,
  balanceConversionRate: 87.3,
  netSalesChangeRate: 12.4,
  receivableChangeRate: -5.2,
  refundRateChange: 0.3,
  balanceConversionRateChange: 2.1,
};

const monthlyStats: SalesOverviewMonthlyStat[] = [
  {
    month: "24.08",
    grossSales: 184_000_000,
    refundAmount: 9_000_000,
    netSales: 175_000_000,
    refundRate: 4.9,
    changeRate: null,
  },
  {
    month: "24.09",
    grossSales: 196_000_000,
    refundAmount: 10_000_000,
    netSales: 186_000_000,
    refundRate: 5.1,
    changeRate: 6.3,
  },
  {
    month: "24.11",
    grossSales: 208_000_000,
    refundAmount: 12_000_000,
    netSales: 196_000_000,
    refundRate: 5.8,
    changeRate: -6.7,
  },
];

describe("재무현황 컴포넌트 테스트", () => {
  test("요약 카드에 재무 지표가 표시된다", () => {
    render(<SalesOverviewSummaryCards summary={summary} />);

    expect(screen.getByLabelText("재무 요약")).toBeVisible();
    expect(screen.getByText("순매출")).toBeVisible();
    expect(screen.getByText("23.4억원")).toBeVisible();
    expect(screen.getByText("총 미수금")).toBeVisible();
    expect(screen.getByText("8450만원")).toBeVisible();
    expect(screen.getByText("환불율 (예약매출 대비)")).toBeVisible();
    expect(screen.getByText("4.8%")).toBeVisible();
    expect(screen.getByText("잔금 전환율")).toBeVisible();
    expect(screen.getByText("87.3%")).toBeVisible();
    expect(screen.getByText("+12.4%")).toBeVisible();
    expect(screen.getByText("-5.2%")).toBeVisible();
    expect(screen.getByText("+0.3%p")).toBeVisible();
    expect(screen.getByText("+2.1%p")).toBeVisible();
  });

  test("월별 매출 표와 CSV 버튼이 동작한다", async () => {
    const user = userEvent.setup();
    const onDownloadCsv = jest.fn().mockResolvedValue(undefined);

    render(
      <SalesOverviewTable
        monthlyStats={monthlyStats}
        onDownloadCsv={onDownloadCsv}
      />
    );

    expect(screen.getByText("월별 매출 상세")).toBeVisible();
    expect(screen.getByText("24.08")).toBeVisible();
    expect(screen.getByText("184M")).toBeVisible();
    expect(
      screen.getByText((_, element) => element?.textContent === "-9M")
    ).toBeVisible();
    expect(screen.getByText("175M")).toBeVisible();
    expect(screen.getByText("4.9%")).toBeVisible();
    expect(screen.getByText("+6.3%")).toBeVisible();
    expect(screen.getByText("-6.7%")).toBeVisible();

    await user.click(screen.getByRole("button", { name: /CSV/ }));

    await waitFor(() => {
      expect(onDownloadCsv).toHaveBeenCalledTimes(1);
    });
  });

  test("월별 매출 데이터가 없으면 빈 상태 문구를 보여준다", () => {
    render(
      <SalesOverviewTable monthlyStats={[]} onDownloadCsv={jest.fn()} />
    );

    expect(screen.getByText("조회된 매출 데이터가 없습니다.")).toBeVisible();
  });
});
