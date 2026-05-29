import CanclelationPolicy from "@/app/(user)/classroom/[continentid]/[countryid]/lecture/[lectureid]/payment/canclelationpolicy/page";

export default function FirstPaymentSummary() {
    return (
        <div className="bg-white rounded-3xl border border-[#E9EEF5] p-6 shadow-sm mt-5">
            <h1 className="text-xl font-bold text-[#0A1628]">
                결제 금액
            </h1>
            
            <div className="mt-6 p-3">
                {/* 원금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">원금</p>
                    <p className="font-bold text-[#0A1628]">89,000원</p>
                </div>
                
                {/* 쿠폰 할인 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">쿠폰 할인</p>
                    <p className="font-bold text-[#E74C3C]">-5,000원</p>
                </div>

                {/* 마일리지 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">마일리지 사용</p>
                    <p className="font-bold text-[#E74C3C]">-10,000원</p>
                </div>

                {/* 예약금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">호텔/항공권 예약금 (30%)</p>
                    <p className="font-bold text-[#0A1628]">227,700원</p>
                </div>
                
                {/* 예약금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#0A1628] font-medium">호텔/항공권 잔금 (출발 7일 전)</p>
                    <p className="font-bold text-[#0A1628]">227,700원</p>
                </div>

                <hr className="border-[#EEF1F5] mt-3 mb-3" />

                {/* 결제 금액 */}
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-[#0A1628]">1차(예약금) 결제 금액</p>
                    <p className="text-2xl font-bold text-[#5E908D]">74,000원</p>
                </div>
                <CanclelationPolicy/>
            </div>
        </div>
    );
}