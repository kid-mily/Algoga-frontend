import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentManageClient from "@/features/moneyadmin/payment/components/PaymentManageClient";
import { useAdminPaymentList } from "@/features/moneyadmin/payment/hooks/useAdminPaymentList";
import { downloadAdminPaymentsExcel } from "@/features/services/adminPayment.service";
import type { AdminPayment } from "@/features/moneyadmin/payment/types";

jest.mock("@/features/moneyadmin/payment/hooks/useAdminPaymentList", () => ({
  useAdminPaymentList: jest.fn(),
}));

jest.mock("@/features/services/adminPayment.service", () => ({
  downloadAdminPaymentsExcel: jest.fn(),
}));

const payments: AdminPayment[] = [
  {
    paymentId: 1,
    displayId: "PAY001",
    bookingId: 101,
    courseId: null,
    userId: 7,
    userName: "김민지",
    productName: "도쿄 패키지 5일",
    paymentType: "FULL",
    paymentTypeLabel: "일시불",
    amount: 800000,
    usedMileage: 0,
    usedCouponId: null,
    status: "SUCCESS",
    statusLabel: "결제 성공",
    portonePaymentId: "portone-001",
    createdAt: "2026.07.15 10:30",
    createdAtRaw: "2026-07-15T10:30:00",
    paymentMethod: "카드",
  },
];

const createHookValue = (override = {}) => ({
  filteredPayments: payments,
  totalCount: 1,
  filteredCount: 1,
  successCount: 1,
  totalAmount: 800000,
  searchKeyword: "",
  fromDate: "2026-07-01",
  toDate: "2026-07-31",
  selectedStatus: "ALL",
  selectedType: "ALL",
  isLoading: false,
  error: "",
  setSearchKeyword: jest.fn(),
  setFromDate: jest.fn(),
  setToDate: jest.fn(),
  setSelectedStatus: jest.fn(),
  setSelectedType: jest.fn(),
  setError: jest.fn(),
  ...override,
});

describe("PaymentManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (downloadAdminPaymentsExcel as jest.Mock).mockResolvedValue(undefined);
    (useAdminPaymentList as jest.Mock).mockReturnValue(createHookValue());
  });

  test("결제 내역 목록과 요약 정보를 렌더링한다", () => {
    render(<PaymentManageClient initialPayments={payments} />);

    expect(screen.getByText("결제 내역 조회")).toBeVisible();
    expect(screen.getByText("총 1건 | 성공 1건 | 조회 금액 800,000원")).toBeVisible();
    expect(screen.getByText("PAY001")).toBeVisible();
    expect(screen.getByText("김민지")).toBeVisible();
    expect(screen.getByText("도쿄 패키지 5일")).toBeVisible();
    expect(screen.getByText("800,000원")).toBeVisible();
    expect(screen.getAllByText("결제 성공")[0]).toBeVisible();
  });

  test("검색어와 결제 유형/상태 필터 변경 시 hook setter를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useAdminPaymentList as jest.Mock).mockReturnValue(hookValue);

    render(<PaymentManageClient />);

    await user.type(
      screen.getByPlaceholderText("결제번호, 사용자명, 상품명, 결제수단 검색"),
      "도쿄"
    );
    await user.selectOptions(screen.getByLabelText("결제 유형 필터"), "FULL");
    await user.selectOptions(screen.getByLabelText("결제 상태 필터"), "SUCCESS");

    expect(hookValue.setSearchKeyword).toHaveBeenCalled();
    expect(hookValue.setSelectedType).toHaveBeenCalledWith("FULL");
    expect(hookValue.setSelectedStatus).toHaveBeenCalledWith("SUCCESS");
  });

  test("시작일이 종료일보다 늦으면 종료일을 자동 조정하고 안내 문구를 보여준다", () => {
    const hookValue = createHookValue({
      fromDate: "2026-07-01",
      toDate: "2026-07-10",
    });
    (useAdminPaymentList as jest.Mock).mockReturnValue(hookValue);

    render(<PaymentManageClient />);

    fireEvent.change(screen.getByLabelText("조회 시작일"), {
      target: { value: "2026-07-20" },
    });

    expect(hookValue.setFromDate).toHaveBeenCalledWith("2026-07-20");
    expect(hookValue.setToDate).toHaveBeenCalledWith("2026-07-20");
    expect(
      screen.getByText("종료일이 시작일과 같도록 자동 조정되었습니다.")
    ).toBeVisible();
  });

  test("엑셀 다운로드 버튼 클릭 시 현재 필터 조건으로 다운로드를 요청한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({
      searchKeyword: "도쿄",
      selectedStatus: "SUCCESS",
      selectedType: "FULL",
    });
    (useAdminPaymentList as jest.Mock).mockReturnValue(hookValue);

    render(<PaymentManageClient />);

    await user.click(screen.getByRole("button", { name: "엑셀 다운로드" }));

    expect(downloadAdminPaymentsExcel).toHaveBeenCalledWith({
      from: "2026-07-01",
      to: "2026-07-31",
      keyword: "도쿄",
      status: "SUCCESS",
      type: "FULL",
    });
  });

  test("결제 내역이 없으면 빈 상태 문구를 보여준다", () => {
    (useAdminPaymentList as jest.Mock).mockReturnValue(
      createHookValue({
        filteredPayments: [],
        totalCount: 0,
        filteredCount: 0,
        successCount: 0,
        totalAmount: 0,
      })
    );

    render(<PaymentManageClient />);

    expect(screen.getByText("조건에 맞는 결제 내역이 없습니다.")).toBeVisible();
  });
});
