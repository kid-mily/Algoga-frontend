import { AdminPayment } from "@/features/moneyadmin/payment/types";
import { formatWon } from "../utils";

type RevenuePaymentsTableProps = {
  payments: AdminPayment[];
};

export default function RevenuePaymentsTable({
  payments,
}: RevenuePaymentsTableProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">월 결제 내역</h2>
      </header>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[132px] px-5 py-4">결제번호</th>
            <th className="w-[150px] px-5 py-4">사용자</th>
            <th className="px-5 py-4">상품명</th>
            <th className="w-[140px] px-5 py-4">결제금액</th>
            <th className="w-[120px] px-5 py-4">상태</th>
            <th className="w-[170px] px-5 py-4">결제일시</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr
                key={payment.paymentId}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  {payment.displayId}
                </td>
                <td className="px-5 py-4">{payment.userName}</td>
                <td className="px-5 py-4">{payment.productName}</td>
                <td className="px-5 py-4 font-bold text-[#111827]">
                  {formatWon(payment.amount)}
                </td>
                <td className="px-5 py-4">{payment.statusLabel}</td>
                <td className="px-5 py-4 text-[#667085]">{payment.createdAt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                role="status"
                aria-live="polite"
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                해당 월 결제 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
