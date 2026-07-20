import { CsRefund, CsRefundStatus } from "@/features/csadmin/refund/types";

export type MoneyRefund = CsRefund;
export type MoneyRefundStatus = CsRefundStatus;
export type MoneyRefundAction = "approve" | "complete" | "reject";

export const moneyRefundStatusOptions: Array<MoneyRefundStatus | "ALL"> = [
  "ALL",
  "취소 요청",
  "정산 검토중",
  "환불 승인",
  "반려",
  "환불 완료",
];

export const moneyRefundActionLabel: Record<MoneyRefundAction, string> = {
  approve: "환불 승인",
  complete: "환불 완료",
  reject: "반려",
};
