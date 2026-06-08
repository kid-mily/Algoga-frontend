export default function PaymentInfo() {
    return (
        <div className="bg-white rounded-3xl border border-[#E9EEF5] p-6 shadow-sm mt-5">
            <h1 className="text-xl font-bold text-[#0A1628]">
                결제 금액
            </h1>
            
            <div className="mt-6 p-3">
                {/* 총 상품 금액 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#8A9BB0] font-bold text-xs">총 상품 금액</p>
                    <p className="font-bold text-[#0A1628]">89,000원</p>
                </div>
                
                {/* 예약금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#8A9BB0] font-bold text-xs">예약금 (30%)</p>
                    <p className="font-bold text-[#E74C3C]">-5,000원</p>
                </div>

                {/* 잔금 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[#8A9BB0] font-bold text-xs">잔금 (출발 14일 전까지)</p>
                    <p className="font-bold text-[#0A1628]">-10,000원</p>
                </div>

                <hr className="border-[#EEF1F5] mt-3 mb-3" />

                {/* 결제 금액 */}
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-[#0A1628]">지금 결제할 금액 (예약금)</p>
                    <p className="text-2xl font-bold text-[#E74C3C]">74,000원</p>
                </div>
            </div>
        </div>
    );
}