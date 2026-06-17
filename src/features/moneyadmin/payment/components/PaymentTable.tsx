import { AdminPayment } from "../types";
import PaymentRow from "./PaymentRow";

type PaymentTableProps = {
  payments: AdminPayment[];
  isLoading: boolean;
};

export default function PaymentTable({
  payments,
  isLoading,
}: PaymentTableProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[132px] px-5 py-4">결제번호</th>
            <th className="w-[150px] px-5 py-4">사용자</th>
            <th className="px-5 py-4">상품명</th>
            <th className="w-[110px] px-5 py-4">결제유형</th>
            <th className="w-[150px] px-5 py-4">결제금액</th>
            <th className="w-[130px] px-5 py-4">결제수단</th>
            <th className="w-[120px] px-5 py-4">상태</th>
            <th className="w-[170px] px-5 py-4">결제일시</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                결제 내역을 불러오는 중입니다...
              </td>
            </tr>
          ) : payments.length > 0 ? (
            payments.map((payment) => (
              <PaymentRow key={payment.paymentId} payment={payment} />
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-[14px] text-[#667085]"
              >
                조건에 맞는 결제 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
