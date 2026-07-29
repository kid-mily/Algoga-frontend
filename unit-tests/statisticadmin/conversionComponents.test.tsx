import { fireEvent, render, screen } from "@testing-library/react";
import CouponConversionSummaryCards from "@/features/statisticadmin/coupon-reservation-conversion/components/CouponConversionSummaryCards";
import CouponPerformanceTable from "@/features/statisticadmin/coupon-reservation-conversion/components/CouponPerformanceTable";
import LectureConversionFunnel from "@/features/statisticadmin/course-reservation-conversion/components/LectureConversionFunnel";
import LectureConversionSummaryCards from "@/features/statisticadmin/course-reservation-conversion/components/LectureConversionSummaryCards";
import LectureCountryConversionTable from "@/features/statisticadmin/course-reservation-conversion/components/LectureCountryConversionTable";

describe("강의·쿠폰 → 예약 전환 표시 컴포넌트 테스트", () => {
  test("강의 전환 요약 카드와 퍼널 값을 표시한다", () => {
    const summary = {
      totalLectureBuyers: 1234,
      completionRate: 80,
      completedToReservationRate: 31.3,
      completedVsIncompleteMultiplier: 6.3,
    };
    const funnel = [
      { key: "buyers" as const, label: "단과 강의 구매", value: 1234, percentage: 100, caption: "전체 구매자", tone: "teal" as const },
      { key: "completed" as const, label: "완강", value: 987, percentage: 80, caption: "전체 대비 80%", tone: "purple" as const },
      { key: "reserved" as const, label: "패키지 예약 완료", value: 250, percentage: 20.3, caption: "전체 대비 20.3%", tone: "orange" as const },
    ];

    render(<><LectureConversionSummaryCards summary={summary} /><LectureConversionFunnel data={funnel} summary={summary} /></>);

    expect(screen.getAllByText("1,234명")).toHaveLength(2);
    expect(screen.getAllByText("80%").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("31.3%")).toHaveLength(2);
    expect(screen.getByText("6.3×")).toBeVisible();
    expect(screen.getByText("패키지 예약 완료")).toBeVisible();
    expect(screen.getByText("250명")).toBeVisible();
  });

  test("나라별 전환 데이터와 평가를 표시하고 CSV 클릭을 전달한다", () => {
    const onDownloadCsv = jest.fn();
    const { rerender } = render(
      <LectureCountryConversionTable
        data={[{ country: "일본", lectureBuyers: 100, completedUsers: 80, reservationUsers: 25, conversionRate: 25, evaluation: "우수" }]}
        onDownloadCsv={onDownloadCsv}
      />
    );

    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("25명")).toBeVisible();
    expect(screen.getByText("25%")).toBeVisible();
    expect(screen.getByText("우수")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "CSV" }));
    expect(onDownloadCsv).toHaveBeenCalledTimes(1);

    rerender(<LectureCountryConversionTable data={[]} onDownloadCsv={onDownloadCsv} />);
    expect(screen.getByText("조회된 나라별 전환 데이터가 없습니다.")).toBeVisible();
  });

  test("쿠폰 전환 요약 카드 값을 표시한다", () => {
    render(
      <CouponConversionSummaryCards
        summary={{ issuedCount: 2500, usedCount: 900, usageRate: 36, availableCount: 1300, reservationConversionRate: 20 }}
      />
    );

    expect(screen.getByText("2,500장")).toBeVisible();
    expect(screen.getByText("900장")).toBeVisible();
    expect(screen.getByText("36%")).toBeVisible();
    expect(screen.getByText("1,300장")).toBeVisible();
    expect(screen.getByText("20%")).toBeVisible();
  });

  test("쿠폰별 성과와 빈 상태를 표시하고 CSV 클릭을 전달한다", () => {
    const onDownloadCsv = jest.fn();
    const { rerender } = render(
      <CouponPerformanceTable
        rows={[{ couponName: "여름 할인", issuedCount: 100, usedCount: 40, usageRate: 40 }]}
        onDownloadCsv={onDownloadCsv}
      />
    );

    expect(screen.getByText("여름 할인")).toBeVisible();
    expect(screen.getByText("100장")).toBeVisible();
    expect(screen.getByText("40장")).toBeVisible();
    expect(screen.getByText("40%")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "CSV" }));
    expect(onDownloadCsv).toHaveBeenCalledTimes(1);

    rerender(<CouponPerformanceTable rows={[]} onDownloadCsv={onDownloadCsv} />);
    expect(screen.getByText("조회된 쿠폰 성과 데이터가 없습니다.")).toBeVisible();
  });
});
