import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  CsRefund,
  RefundRequestApiRecord,
  refundStatusLabel,
} from "@/features/csadmin/refund/types";
import type { ApiRequestOptions } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

const formatDate = (value: string | undefined) => {
  if (!value) return "-";

  return value.includes("T") ? formatDateTime(value).slice(0, 10) : value;
};

export const normalizeRefund = (item: RefundRequestApiRecord): CsRefund => {
  const status = refundStatusLabel[item.status] ?? "취소 요청";

  return {
    refundId: item.refundId,
    bookingRawId: item.bookingId,
    paymentId: item.paymentId,
    userId: item.userId,
    id: `REF${String(item.refundId).padStart(3, "0")}`,
    bookingId: item.bookingNumber || `BK${String(item.bookingId).padStart(6, "0")}`,
    user: item.userName || `회원 #${item.userId}`,
    userLabel: `회원 #${item.userId}`,
    product: item.productName || "-",
    requestedAt: formatDate(item.createdAt),
    requestDateTime: formatDateTime(item.createdAt),
    reason: item.reason || "-",
    rejectReason: item.rejectReason ?? "",
    status,
    statusCode: item.status,
    paymentAmount: item.paidAmount ?? 0,
    refundAmount: item.amount ?? 0,
    paymentMethod: item.paymentMethod || "-",
    bookedAt: formatDateTime(item.createdAt),
    useDate: item.checkInDate || "-",
    adminMemo: item.rejectReason ?? "",
    historyCount: item.updatedAt && item.updatedAt !== item.createdAt ? 1 : 0,
    totalBookings: 0,
  };
};

export const getAdminRefunds = async (
  options: Pick<ApiRequestOptions, "headers" | "signal"> = {}
): Promise<CsRefund[]> => {
  const response = await adminApi.get<ApiResult<RefundRequestApiRecord[]>>(
    "/api/v1/admin/refund-requests",
    {
      suppressGlobalError: true,
      ...options,
    }
  );
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeRefund) : [];
};

export const getAdminRefundById = async (
  refundId: number,
  signal?: AbortSignal
): Promise<CsRefund | null> => {
  const response = await adminApi.get<ApiResult<RefundRequestApiRecord | null>>(
    `/api/v1/admin/refund-requests/${refundId}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return data ? normalizeRefund(data) : null;
};

export const requestRefundReview = async (refundId: number): Promise<void> => {
  await adminApi.put<ApiResult<string>>(
    `/api/v1/admin/refund-requests/${refundId}/review`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const approveRefund = async (refundId: number): Promise<void> => {
  await adminApi.put<ApiResult<string>>(
    `/api/v1/admin/refund-requests/${refundId}/approve`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const rejectRefund = async (refundId: number): Promise<void> => {
  await adminApi.put<ApiResult<string>>(
    `/api/v1/admin/refund-requests/${refundId}/reject`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const completeRefund = async (refundId: number): Promise<void> => {
  await adminApi.put<ApiResult<string>>(
    `/api/v1/admin/refund-requests/${refundId}/complete`,
    undefined,
    { suppressGlobalError: true }
  );
};

/** 클라이언트 전용 함수 - 브라우저 API와 다운로드 UI를 사용합니다. */
export const downloadRefundExcel = async (signal?: AbortSignal) => {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  if (signal?.aborted) {
    throw new DOMException("?? ?? ?? ????? ???????.", "AbortError");
  }

  const controller = new AbortController();
  const abortRequest = () => controller.abort();
  let didTimeout = false;
  const timeoutId = window.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, 15000);

  signal?.addEventListener("abort", abortRequest, { once: true });

  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/refund-requests/excel`, {
      credentials: "include",
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "환불 내역 엑셀 다운로드에 실패했습니다.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "refund-requests.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: unknown) {
    if (didTimeout) {
      throw new Error("환불 내역 엑셀 다운로드 시간이 초과되었습니다.");
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("환불 내역 엑셀 다운로드가 취소되었습니다.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
};

