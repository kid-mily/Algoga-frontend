import { AdminPayment } from "../types";
import { formatWon } from "../utils";
import PaymentStatusBadge from "./PaymentStatusBadge";

type PaymentRowProps = {
  payment: AdminPayment;
};

export default function PaymentRow({ payment }: PaymentRowProps) {
  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-5 py-4 font-semibold text-[#111827]">
        {payment.displayId}
      </td>
      <td className="px-5 py-4">
        <p className="font-semibold text-[#111827]">{payment.userName}</p>
        <p className="mt-1 text-[12px] text-[#98A2B3]">
          회원 #{payment.userId}
        </p>
      </td>
      <td className="px-5 py-4">
        <p className="line-clamp-1 font-semibold text-[#344054]">
          {payment.productName}
        </p>
        <p className="mt-1 text-[12px] text-[#98A2B3]">
          {payment.bookingId ? `예약 #${payment.bookingId}` : "예약 정보 없음"}
        </p>
      </td>
      <td className="px-5 py-4">{payment.paymentTypeLabel}</td>
      <td className="px-5 py-4 font-bold text-[#111827]">
        {formatWon(payment.amount)}
      </td>
      <td className="px-5 py-4">토스페이</td>
      <td className="px-5 py-4">
        <PaymentStatusBadge status={payment.status} label={payment.statusLabel} />
      </td>
      <td className="px-5 py-4 text-[#667085]">{payment.createdAt}</td>
    </tr>
  );
}
