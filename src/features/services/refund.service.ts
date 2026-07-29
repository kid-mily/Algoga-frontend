import { api, type ApiResult, unwrapData } from "@/lib/api";

// 관리자용 REQUESTED/UPPER_REVIEW/UNDER_REVIEW/APPROVED/REJECTED/COMPLETED와 동일한 상태값
export type RefundApiStatus =
  | "REQUESTED"
  | "UPPER_REVIEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | string;

// GET /refund-requests/me, POST /refund-requests 응답이 공유하는 환불 요청 한 건의 형태
export interface RefundRequestRecord {
  refundId: number;
  bookingId: number;
  paymentId: number;
  userId: number;
  status: RefundApiStatus;
  reason: string;
  rejectReason: string | null;
  amount: number;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  productName: string | null;
  bookingNumber: string | null;
  checkInDate: string | null;
  paidAmount: number | null;
  paymentMethod: string | null;
}

// 내 환불 요청 목록 조회 (마이페이지 예약 내역의 "환불 내역" 탭)
export async function getMyRefundRequests(
  signal?: AbortSignal
): Promise<RefundRequestRecord[]> {
  const response = await api.get<ApiResult<RefundRequestRecord[]>>(
    "/api/v1/refund-requests/me",
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response) ?? [];
}

// 환불 요청 전에 예약을 먼저 취소 처리한다 (REF_006: 취소된 예약만 환불 요청 가능)
export async function cancelBooking(
  bookingId: number,
  signal?: AbortSignal
): Promise<void> {
  await api.delete<ApiResult<null>>(`/api/v1/bookings/${bookingId}/cancel`, {
    signal,
    suppressGlobalError: true,
  });
}

export interface CreateRefundRequestPayload {
  bookingId: number;
  paymentId: number;
  reason: string;
}

// POST /refund-requests 응답의 data는 생성된 refundId 하나뿐이다
export async function createRefundRequest(
  payload: CreateRefundRequestPayload,
  signal?: AbortSignal
): Promise<number> {
  const response = await api.post<ApiResult<number>>(
    "/api/v1/refund-requests",
    payload,
    {
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
}
