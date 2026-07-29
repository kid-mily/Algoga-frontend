import {
  CsRefund,
  sortRefundsByRequestedAtDesc,
} from "@/features/csadmin/refund/types";

const createRefund = (
  refundId: number,
  requestDateTime: string,
  requestedAt = requestDateTime
): CsRefund => ({
  refundId,
  bookingId: `BK-${refundId}`,
  bookingRawId: refundId,
  paymentId: refundId,
  userId: refundId,
  id: `REF${refundId}`,
  user: "김진도",
  userLabel: "U0001",
  product: "도쿄 패키지",
  requestedAt,
  requestDateTime,
  reason: "개인 사정",
  rejectReason: "",
  status: "취소 요청",
  statusCode: "REQUESTED",
  paymentAmount: 800000,
  refundAmount: 700000,
  paymentMethod: "CARD",
  bookingCreatedAt: "2026.07.01 10:00",
  paymentCreatedAt: "2026.07.01 10:00",
  useDate: "2026.08.01",
  adminMemo: "",
});

describe("CS 환불관리 타입 유틸 테스트", () => {
  test("환불 목록을 취소요청일 최신순으로 정렬한다", () => {
    const refunds = [
      createRefund(1, "2026-07-18T10:00:00Z"),
      createRefund(2, "2026-07-20T10:00:00Z"),
      createRefund(3, "2026-07-19T10:00:00Z"),
    ];

    expect(sortRefundsByRequestedAtDesc(refunds).map((refund) => refund.refundId))
      .toEqual([2, 3, 1]);
  });

  test("취소요청일이 같으면 최신 환불 ID가 먼저 온다", () => {
    const refunds = [
      createRefund(1, "2026-07-20T10:00:00Z"),
      createRefund(3, "2026-07-20T10:00:00Z"),
      createRefund(2, "2026-07-20T10:00:00Z"),
    ];

    expect(sortRefundsByRequestedAtDesc(refunds).map((refund) => refund.refundId))
      .toEqual([3, 2, 1]);
  });

  test("원본 배열을 직접 변경하지 않는다", () => {
    const refunds = [
      createRefund(1, "2026-07-18T10:00:00Z"),
      createRefund(2, "2026-07-20T10:00:00Z"),
    ];

    const sorted = sortRefundsByRequestedAtDesc(refunds);

    expect(sorted).not.toBe(refunds);
    expect(refunds.map((refund) => refund.refundId)).toEqual([1, 2]);
    expect(sorted.map((refund) => refund.refundId)).toEqual([2, 1]);
  });
});
