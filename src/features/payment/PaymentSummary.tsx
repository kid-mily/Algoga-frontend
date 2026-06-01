import CanclelationPolicy from "@/app/(user)/classroom/[continentCode]/[countryid]/lecture/[courseId]/payment/canclelationpolicy/page";

interface Props {
    price: number;
    couponDiscount: number;
    usedMileage: number;
    finalAmount: number;
}

export default function PaymentSummary({ price, couponDiscount, usedMileage, finalAmount }: Props) {
    return (
        <div className="bg-white rounded-3xl border border-[#E9EEF5] p-6 shadow-sm mt-5">
            <h1 className="text-xl font-bold text-[#0A1628]">
                결제 금액
            </h1>
            
            <div className="mt-6 p-3">
                {/* 원금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">강의 금액</p>
                    <p className="font-bold text-[#0A1628]">{price.toLocaleString()}원</p>
                </div>
                
                {/* 쿠폰 할인 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">쿠폰 할인</p>
                    <p className="font-bold text-[#E74C3C]">-{couponDiscount.toLocaleString()}원</p>
                </div>

                {/* 마일리지 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">마일리지 사용</p>
                    <p className="font-bold text-[#E74C3C]">-{usedMileage.toLocaleString()}원</p>
                </div>

                <hr className="border-[#EEF1F5] mt-3 mb-3" />

                {/* 결제 금액 */}
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-[#0A1628]">최종 결제 금액</p>
                    <p className="text-2xl font-bold text-[#5E908D]">{finalAmount.toLocaleString()}원</p>
                </div>
                <CanclelationPolicy/>
            </div>
        </div>
    );
}