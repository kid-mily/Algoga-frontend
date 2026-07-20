import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BalanceRecoveryLineChart from "@/features/statisticadmin/balance/components/BalanceRecoveryLineChart";
import BalanceSummaryCards from "@/features/statisticadmin/balance/components/BalanceSummaryCards";
import CountryBalanceConversionBarChart from "@/features/statisticadmin/balance/components/CountryBalanceConversionBarChart";
import OutstandingReservationTable from "@/features/statisticadmin/balance/components/OutstandingReservationTable";
import type {
  BalanceSummary,
  CountryBalanceConversion,
  OutstandingReservation,
  RecoveryRatePoint,
} from "@/features/statisticadmin/balance/types";

const summary: BalanceSummary = {
  conversionRate: 87.3,
  outstandingAmount: 84_500_000,
  depositPaidCount: 126,
  fullPaidCount: 110,
  atRiskCount: 38,
  dueSoonCount: 126,
};

const recoveryRates: RecoveryRatePoint[] = [
  { day: 0, rate: 45 },
  { day: 30, rate: 82 },
  { day: 90, rate: 96 },
];

const countryConversions: CountryBalanceConversion[] = [
  {
    countryName: "일본",
    conversionRate: 91,
    depositPaidCount: 120,
    fullPaidCount: 109,
  },
  {
    countryName: "프랑스",
    conversionRate: 86,
    depositPaidCount: 100,
    fullPaidCount: 86,
  },
];

const reservations: OutstandingReservation[] = [
  {
    bookingNumber: "BK-2024-0841",
    customerName: "김민준",
    productName: "오사카 패키지 5일",
    outstandingAmount: 420_000,
    contractDate: "2024.05.10",
    elapsedDays: 58,
    checkInDate: "2024.07.08",
    dDay: -7,
  },
  {
    bookingNumber: "BK-2024-0792",
    customerName: "이서연",
    productName: "파리 클래식 7일",
    outstandingAmount: 630_000,
    contractDate: "2024.05.02",
    elapsedDays: 66,
    checkInDate: "2024.07.12",
    dDay: 3,
  },
];

describe("잔금 관리 컴포넌트 테스트", () => {
  test("요약 카드에 잔금 지표가 표시된다", () => {
    render(<BalanceSummaryCards summary={summary} />);

    expect(screen.getByText("잔금 전환율")).toBeVisible();
    expect(screen.getByText("87.3%")).toBeVisible();
    expect(screen.getByText("미수금")).toBeVisible();
    expect(screen.getByText("84,500,000원")).toBeVisible();
    expect(screen.getByText("D-day 임박 미납")).toBeVisible();
    expect(screen.getByText("126건")).toBeVisible();
    expect(screen.getByText("위험(At-risk) 건수")).toBeVisible();
    expect(screen.getByText("38건")).toBeVisible();
  });

  test("잔금 회수 곡선과 국가별 전환율 차트 제목을 표시한다", () => {
    render(
      <>
        <BalanceRecoveryLineChart data={recoveryRates} />
        <CountryBalanceConversionBarChart data={countryConversions} />
      </>
    );

    expect(
      screen.getByText("누적 납부율 곡선 (계약금 납부 후 경과일)")
    ).toBeVisible();
    expect(screen.getByText("국가별 잔금 전환율")).toBeVisible();
  });

  test("미납 예약 표와 CSV 버튼이 동작한다", async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    const onDownloadCsv = jest.fn().mockResolvedValue(undefined);

    render(
      <OutstandingReservationTable
        data={reservations}
        search=""
        onSearchChange={onSearchChange}
        onDownloadCsv={onDownloadCsv}
      />
    );

    expect(screen.getByText("미납 예약 목록")).toBeVisible();
    expect(screen.getByText("BK-2024-0841")).toBeVisible();
    expect(screen.getByText("김민준")).toBeVisible();
    expect(screen.getByText("오사카 패키지 5일")).toBeVisible();
    expect(screen.getByText("420,000원")).toBeVisible();
    expect(screen.getByText("58일")).toBeVisible();
    expect(screen.getByText("D-7")).toBeVisible();
    expect(screen.getByText("D+3")).toBeVisible();

    await user.type(screen.getByLabelText("고객명 상품명 검색"), "파리");
    expect(onSearchChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /CSV/ }));

    await waitFor(() => {
      expect(onDownloadCsv).toHaveBeenCalledTimes(1);
    });
  });

  test("미납 예약 표의 로딩과 빈 상태를 보여준다", () => {
    const { rerender } = render(
      <OutstandingReservationTable
        data={[]}
        search=""
        onSearchChange={jest.fn()}
        onDownloadCsv={jest.fn()}
        isLoading
      />
    );

    expect(screen.getByText("미납 예약 목록을 불러오는 중입니다...")).toBeVisible();

    rerender(
      <OutstandingReservationTable
        data={[]}
        search=""
        onSearchChange={jest.fn()}
        onDownloadCsv={jest.fn()}
      />
    );

    expect(screen.getByText("미납 예약이 없습니다.")).toBeVisible();
  });
});
