import { render, screen } from "@testing-library/react";
import CancellationStageDonutChart from "@/features/statisticadmin/refund/components/CancellationStageDonutChart";
import CountryRefundRateTable from "@/features/statisticadmin/refund/components/CountryRefundRateTable";
import RefundMonthlyTrendChart from "@/features/statisticadmin/refund/components/RefundMonthlyTrendChart";
import RefundReasonTable from "@/features/statisticadmin/refund/components/RefundReasonTable";
import RefundSummaryCards from "@/features/statisticadmin/refund/components/RefundSummaryCards";
import RefundTimingDistribution from "@/features/statisticadmin/refund/components/RefundTimingDistribution";
import type {
  CancellationStage,
  CountryRefundRate,
  RefundMonthlyTrend,
  RefundReason,
  RefundSummary,
  RefundTiming,
} from "@/features/statisticadmin/refund/types";

const summary: RefundSummary = {
  refundRate: 4.8,
  netRevenue: 2_341_000_000,
  paidCancelCount: 38,
  paymentCancelRate: 2.1,
};

const monthlyTrends: RefundMonthlyTrend[] = [
  {
    month: "24.08",
    grossRevenue: 184_000_000,
    refundAmount: 9_000_000,
    netRevenue: 175_000_000,
  },
  {
    month: "24.09",
    grossRevenue: 196_000_000,
    refundAmount: 10_000_000,
    netRevenue: 186_000_000,
  },
];

const refundTimings: RefundTiming[] = [
  {
    label: "14일 이상 취소 (100% 환불)",
    count: 214,
    rate: 53.6,
    color: "#2FAE9B",
  },
  {
    label: "7일 미만 취소 (0%, 위약금)",
    count: 58,
    rate: 14.6,
    color: "#EC4899",
  },
];

const cancellationStages: CancellationStage[] = [
  {
    label: "미결제 취소",
    count: 158,
    rate: 40,
    color: "#B8C0CC",
  },
  {
    label: "선급 후 취소",
    count: 203,
    rate: 51,
    color: "#F59E0B",
  },
  {
    label: "완납 후 취소",
    count: 38,
    rate: 10,
    color: "#EC4899",
  },
];

const refundReasons: RefundReason[] = [
  { reason: "개인 사정", count: 142, rate: 35.6 },
  { reason: "일정 변경", count: 98, rate: 24.6 },
];

const countryRefundRates: CountryRefundRate[] = [
  {
    countryName: "독일",
    bookingCount: 265,
    refundRate: 7.1,
    status: "위험",
  },
  {
    countryName: "프랑스",
    bookingCount: 2108,
    refundRate: 4.2,
    status: "주의",
  },
  {
    countryName: "미국",
    bookingCount: 1876,
    refundRate: 4.5,
    status: "양호",
  },
];

describe("환불 관리 컴포넌트 테스트", () => {
  test("요약 카드에 환불 지표가 표시된다", () => {
    render(<RefundSummaryCards summary={summary} />);

    expect(screen.getByText(/환불율/)).toBeVisible();
    expect(screen.getByText("4.8%")).toBeVisible();
    expect(screen.getByText("순매출")).toBeVisible();
    expect(screen.getByText("2,341,000,000원")).toBeVisible();
    expect(screen.getByText("완납 후 취소")).toBeVisible();
    expect(screen.getByText("38건")).toBeVisible();
    expect(screen.getByText("결제 취소율")).toBeVisible();
    expect(screen.getByText("2.1%")).toBeVisible();
  });

  test("월별 환불 추이 차트 제목과 범례를 표시한다", () => {
    render(<RefundMonthlyTrendChart data={monthlyTrends} unit="DAY" />);

    expect(screen.getByText("일별 매출 · 환불 · 순매출 추이")).toBeVisible();
    expect(screen.getByText("단위: 백만원")).toBeVisible();
  });

  test("환불 타이밍 분포와 취소 단계 구성을 표시한다", () => {
    render(
      <>
        <RefundTimingDistribution data={refundTimings} />
        <CancellationStageDonutChart data={cancellationStages} />
      </>
    );

    expect(screen.getByText("환불 타이밍 분포")).toBeVisible();
    expect(screen.getByText("14일 이상 취소 (100% 환불)")).toBeVisible();
    expect(screen.getByText("53.6%")).toBeVisible();
    expect(screen.getByText("(214건)")).toBeVisible();
    expect(screen.getByText("총 취소 272건 기준")).toBeVisible();

    expect(screen.getByText("취소 단계별 구성")).toBeVisible();
    expect(screen.getByText("399")).toBeVisible();
    expect(screen.getByText("총 취소건")).toBeVisible();
    expect(screen.getByText("미결제 취소")).toBeVisible();
    expect(screen.getByText("선급 후 취소")).toBeVisible();
    expect(screen.getByText("완납 후 취소")).toBeVisible();
  });

  test("환불 사유 표와 나라별 환불율 표를 표시한다", () => {
    render(
      <>
        <RefundReasonTable data={refundReasons} />
        <CountryRefundRateTable data={countryRefundRates} />
      </>
    );

    expect(screen.getByText("환불 사유")).toBeVisible();
    expect(screen.getByText("개인 사정")).toBeVisible();
    expect(screen.getByText("142건")).toBeVisible();
    expect(screen.getByText("35.6%")).toBeVisible();

    expect(screen.getByText("나라별 환불율")).toBeVisible();
    expect(screen.getByText("독일")).toBeVisible();
    expect(screen.getByText("265건")).toBeVisible();
    expect(screen.getByText("7.1%")).toBeVisible();
    expect(screen.getByText("위험")).toBeVisible();
    expect(screen.getByText("주의")).toBeVisible();
    expect(screen.getByText("양호")).toBeVisible();
  });
});
