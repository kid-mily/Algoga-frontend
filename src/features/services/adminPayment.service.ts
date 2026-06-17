import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminPayment,
  AdminPaymentApiRecord,
  PaymentStatus,
  PaymentType,
  paymentStatusLabels,
  paymentTypeLabels,
} from "@/features/moneyadmin/payment/types";
import { formatDateTime } from "@/features/moneyadmin/payment/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const getRecord = (item: unknown): Record<string, unknown> =>
  item && typeof item === "object" ? (item as Record<string, unknown>) : {};

const getPaymentItems = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.payments)) return record.payments;

  return [];
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;

  return toNumber(value);
};

const toString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value : fallback;

const isNumberLike = (value: unknown) => {
  return (
    (typeof value === "number" && Number.isFinite(value)) ||
    (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)))
  );
};

const isNonEmptyString = (value: unknown) => {
  return typeof value === "string" && value.trim() !== "";
};

const isAdminPaymentApiRecord = (
  record: Record<string, unknown>
): record is AdminPaymentApiRecord => {
  return (
    isNumberLike(record.paymentId) &&
    isNumberLike(record.userId) &&
    isNumberLike(record.amount) &&
    isNonEmptyString(record.paymentType) &&
    isNonEmptyString(record.status) &&
    isNonEmptyString(record.createdAt)
  );
};

const paymentTypes: PaymentType[] = [
  "DEPOSIT",
  "BALANCE",
  "FULL",
  "LECTURE",
  "LECTURE_ONLY",
  "PACKAGE",
  "PACKAGE_FULL",
  "PACKAGE_DEPOSIT",
  "PACKAGE_BALANCE",
  "UNKNOWN",
];

const paymentStatuses: PaymentStatus[] = [
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "PENDING",
  "REFUNDED",
  "UNKNOWN",
];

const toPaymentType = (value: unknown): PaymentType => {
  const text = toString(value, "UNKNOWN");

  return paymentTypes.includes(text as PaymentType)
    ? (text as PaymentType)
    : "UNKNOWN";
};

const toPaymentStatus = (value: unknown): PaymentStatus => {
  const text = toString(value, "UNKNOWN");

  return paymentStatuses.includes(text as PaymentStatus)
    ? (text as PaymentStatus)
    : "UNKNOWN";
};

export const normalizeAdminPayment = (
  item: unknown,
  fallbackId = 0
): AdminPayment => {
  const record = getRecord(item);

  if (!isAdminPaymentApiRecord(record)) {
    throw new Error("결제 내역 응답 형식이 올바르지 않습니다.");
  }

  const paymentId = toNumber(record.paymentId, fallbackId);
  const paymentType = toPaymentType(record.paymentType);
  const status = toPaymentStatus(record.status);
  const userId = toNumber(record.userId);
  const paymentTypeLabel =
    paymentType === "LECTURE_ONLY"
      ? "단과결제"
      : paymentTypeLabels[paymentType] ?? "패키지 결제";

  return {
    paymentId,
    displayId: `PAY${String(paymentId).padStart(6, "0")}`,
    bookingId: toNullableNumber(record.bookingId),
    courseId: toNullableNumber(record.courseId),
    userId,
    userName: toString(record.userName, `회원 #${userId}`),
    productName: toString(record.productName, "-"),
    paymentType,
    paymentTypeLabel,
    amount: toNumber(record.amount),
    usedMileage: toNumber(record.usedMileage),
    usedCouponId: toNullableNumber(record.usedCouponId),
    status,
    statusLabel: paymentStatusLabels[status],
    portonePaymentId: toString(record.portonePaymentId, "-"),
    createdAt: formatDateTime(toString(record.createdAt)),
    createdAtRaw: toString(record.createdAt),
    paymentMethod: toString(record.paymentMethod, "-"),
  };
};

export const getAdminPayments = async ({
  from,
  to,
  signal,
}: {
  from: string;
  to?: string;
  signal?: AbortSignal;
}): Promise<AdminPayment[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/payments",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return getPaymentItems(data).map((item, index) =>
    normalizeAdminPayment(item, index + 1)
  );
};

type DownloadAdminPaymentsExcelParams = {
  from?: string;
  to?: string;
  keyword?: string;
  status?: PaymentStatus | "ALL";
  type?: PaymentType | "ALL";
  signal?: AbortSignal;
};

export const downloadAdminPaymentsExcel = async ({
  from,
  to,
  keyword,
  status,
  type,
  signal,
}: DownloadAdminPaymentsExcelParams = {}) => {
  if (typeof window === "undefined") return;

  if (signal?.aborted) {
    throw new DOMException("결제 내역 엑셀 다운로드가 취소되었습니다.", "AbortError");
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
    const requestUrl = new URL(
      `${BASE_URL}/api/v1/admin/payments/excel`,
      window.location.origin
    );

    if (from) requestUrl.searchParams.set("from", from);
    if (to) requestUrl.searchParams.set("to", to);
    if (keyword?.trim()) requestUrl.searchParams.set("keyword", keyword.trim());
    if (status && status !== "ALL") requestUrl.searchParams.set("status", status);
    if (type && type !== "ALL") requestUrl.searchParams.set("type", type);

    const response = await fetch(requestUrl.toString(), {
      credentials: "include",
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "결제 내역 엑셀 다운로드에 실패했습니다."
      );
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "admin-payments.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (error: unknown) {
    if (didTimeout) {
      throw new Error("결제 내역 엑셀 다운로드 시간이 초과되었습니다.");
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("결제 내역 엑셀 다운로드가 취소되었습니다.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
};
