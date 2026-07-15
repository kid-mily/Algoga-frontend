import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoneyRefundManageClient from "@/features/moneyadmin/refund/components/MoneyRefundManageClient";
import {
  approveRefund,
  completeRefund,
  getAdminRefunds,
} from "@/features/services/adminRefund.service";
import type { MoneyRefund } from "@/features/moneyadmin/refund/types";

jest.mock("@/features/services/adminRefund.service", () => ({
  approveRefund: jest.fn(),
  completeRefund: jest.fn(),
  getAdminRefunds: jest.fn(),
}));

const refunds: MoneyRefund[] = [
  {
    refundId: 1,
    bookingId: "BK-2026-001",
    bookingRawId: 101,
    paymentId: 301,
    userId: 77,
    id: "REF001",
    user: "김민지",
    userLabel: "회원 #77",
    product: "도쿄 패키지 5일",
    requestedAt: "2026.07.15",
    requestDateTime: "2026.07.15 10:30",
    reason: "일정 변경",
    rejectReason: "",
    status: "정산 검토중",
    statusCode: "UPPER_REVIEW",
    paymentAmount: 900000,
    refundAmount: 700000,
    paymentMethod: "카드",
    bookingCreatedAt: "2026.07.01 12:00",
    paymentCreatedAt: "2026.07.01 12:00",
    useDate: "2026.08.01",
    adminMemo: "",
  },
  {
    refundId: 2,
    bookingId: "BK-2026-002",
    bookingRawId: 102,
    paymentId: 302,
    userId: 78,
    id: "REF002",
    user: "박서준",
    userLabel: "회원 #78",
    product: "파리 패키지 7일",
    requestedAt: "2026.07.14",
    requestDateTime: "2026.07.14 11:20",
    reason: "개인 사정",
    rejectReason: "",
    status: "환불 승인",
    statusCode: "APPROVED",
    paymentAmount: 1200000,
    refundAmount: 950000,
    paymentMethod: "카드",
    bookingCreatedAt: "2026.07.02 12:00",
    paymentCreatedAt: "2026.07.02 12:00",
    useDate: "2026.08.10",
    adminMemo: "",
  },
];

describe("MoneyRefundManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (approveRefund as jest.Mock).mockResolvedValue(undefined);
    (completeRefund as jest.Mock).mockResolvedValue(undefined);
    (getAdminRefunds as jest.Mock).mockResolvedValue(refunds);
  });

  test("환불 승인 관리 목록과 요약 정보를 렌더링한다", () => {
    render(<MoneyRefundManageClient initialRefunds={refunds} hasInitialData />);

    expect(screen.getByText("환불 승인 관리")).toBeVisible();
    expect(screen.getByText("도쿄 패키지 5일")).toBeVisible();
    expect(screen.getByText("파리 패키지 7일")).toBeVisible();
    expect(
      screen.getByText("총 2건 | 처리 대기 1건 | 승인 후 완료 대기 1건")
    ).toBeVisible();
    expect(screen.getByText(/처리 대기 1건/)).toBeVisible();
    expect(screen.getByText(/승인 후 완료 대기 1건/)).toBeVisible();
  });

  test("검색어로 목록을 필터링한다", async () => {
    const user = userEvent.setup();

    render(<MoneyRefundManageClient initialRefunds={refunds} hasInitialData />);

    await user.type(screen.getByPlaceholderText("요청번호, 예약번호, 사용자, 상품명 검색"), "파리");

    expect(screen.getByText("파리 패키지 7일")).toBeVisible();
    expect(screen.queryByText("도쿄 패키지 5일")).not.toBeInTheDocument();
  });

  test("승인 처리 확인 후 완료 모달을 보여준다", async () => {
    const user = userEvent.setup();

    render(<MoneyRefundManageClient initialRefunds={refunds} hasInitialData />);

    await user.click(screen.getAllByRole("button", { name: "승인" })[0]);

    expect(screen.getByText("REF001 요청을 환불 승인 처리하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(approveRefund).toHaveBeenCalledWith(1);
    });
    expect(getAdminRefunds).toHaveBeenCalled();
    expect(screen.getByText("환불 승인 처리가 완료되었습니다.")).toBeVisible();
  });
});
