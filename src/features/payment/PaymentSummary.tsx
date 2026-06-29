import CanclelationPolicy from "@/app/(user)/classroom/[continentCode]/[countryid]/lecture/[courseId]/payment/canclelationpolicy/page";
import { getCountryTicketStyle } from "@/features/classroom/components/countryTicketStyle";

interface Props {
  price: number;
  couponDiscount: number;
  usedMileage: number;
  finalAmount: number;
  continentCode: string;
}

export default function PaymentSummary({
  price,
  couponDiscount,
  usedMileage,
  finalAmount,
  continentCode,
}: Props) {
  const style = getCountryTicketStyle(continentCode);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.06)]">
      <div className={`h-1.5 w-full ${style.accent}`} />

      <div className="p-6">
        <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
          PAYMENT SUMMARY
        </p>

        <h2 className="mt-1 text-lg font-bold text-[#0A1628]">결제 금액</h2>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#667085]">강의 금액</span>
            <strong className="text-[#0A1628]">
              {price.toLocaleString()}원
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#667085]">쿠폰 할인</span>
            <strong className="text-[#D92D20]">
              -{couponDiscount.toLocaleString()}원
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#667085]">마일리지 사용</span>
            <strong className="text-[#D92D20]">
              -{usedMileage.toLocaleString()}원
            </strong>
          </div>
        </div>

        <div className="mt-5 border-t border-dashed border-[#D6E0E8] pt-5">
          <div className="flex items-end justify-between gap-3">
            <span className="text-sm font-bold text-[#0A1628]">
              최종 결제 금액
            </span>

            <strong className={`text-2xl font-black ${style.text}`}>
              {finalAmount.toLocaleString()}원
            </strong>
          </div>
        </div>

        <div className="mt-4">
          <CanclelationPolicy />
        </div>
      </div>
    </section>
  );
}