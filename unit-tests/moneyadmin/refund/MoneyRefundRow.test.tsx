import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoneyRefundRow from "@/features/moneyadmin/refund/components/MoneyRefundRow";
import type { MoneyRefund } from "@/features/moneyadmin/refund/types";

const createRefund = (
  status: MoneyRefund["status"],
  statusCode: MoneyRefund["statusCode"]
): MoneyRefund => ({
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
  status,
  statusCode,
  paymentAmount: 900000,
  refundAmount: 700000,
  paymentMethod: "카드",
  bookingCreatedAt: "2026.07.01 12:00",
  paymentCreatedAt: "2026.07.01 12:00",
  useDate: "2026.08.01",
  adminMemo: "",
});

const renderRow = (refund: MoneyRefund, onAction = jest.fn()) => {
  render(
    <table>
      <tbody>
        <MoneyRefundRow
          refund={refund}
          processingId={null}
          actionsDisabled={false}
          onAction={onAction}
        />
      </tbody>
    </table>
  );

  return onAction;
};

describe("MoneyRefundRow 컴포넌트 테스트", () => {
  test("정산 검토중 상태에서는 승인 버튼만 활성화된다", async () => {
    const user = userEvent.setup();
    const refund = createRefund("정산 검토중", "UNDER_REVIEW");
    const onAction = renderRow(refund);

    expect(screen.getByText("정산 검토중")).toBeVisible();
    expect(screen.getByRole("button", { name: "승인" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "반려" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "완료" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "승인" }));

    expect(onAction).toHaveBeenCalledWith(refund, "approve");
  });

  test("UNDER_REVIEW 상태도 승인 가능 상태로 처리한다", () => {
    renderRow(createRefund("정산 검토중", "UNDER_REVIEW"));

    expect(screen.getByRole("button", { name: "승인" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "반려" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "완료" })).not.toBeInTheDocument();
  });

  test("환불 승인 상태에서는 완료 버튼만 활성화된다", async () => {
    const user = userEvent.setup();
    const refund = createRefund("환불 승인", "APPROVED");
    const onAction = renderRow(refund);

    expect(screen.queryByRole("button", { name: "승인" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "반려" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "완료" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "완료" }));

    expect(onAction).toHaveBeenCalledWith(refund, "complete");
  });

  test("종료 상태에서는 처리 버튼이 비활성화된다", () => {
    renderRow(createRefund("환불 완료", "COMPLETED"));

    expect(screen.queryByRole("button", { name: "승인" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "완료" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "반려" })).not.toBeInTheDocument();
    expect(screen.getByText("-")).toBeVisible();
  });
});
