import { PaymentStatus } from "../types";

const statusStyle: Record<PaymentStatus, string> = {
  SUCCESS: "bg-[#E7F4EC] text-[#027A48]",
  FAILED: "bg-[#FEF2F2] text-[#B42318]",
  CANCELLED: "bg-[#F2F4F7] text-[#667085]",
  PENDING: "bg-[#FFF7E6] text-[#B54708]",
  REFUNDED: "bg-[#EFF8FF] text-[#175CD3]",
  UNKNOWN: "bg-[#F2F4F7] text-[#344054]",
};

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
  label: string;
};

export default function PaymentStatusBadge({
  status,
  label,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-[28px] min-w-[78px] items-center justify-center rounded-full px-3 text-[12px] font-bold ${
        statusStyle[status]
      }`}
    >
      {label}
    </span>
  );
}
