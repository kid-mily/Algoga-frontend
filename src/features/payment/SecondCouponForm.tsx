export default function SecondCouponForm() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/UserCoupon.svg" alt="쿠폰" />
                <h1 className="ml-2 font-bold">할인 쿠폰</h1>
                <p className="text-gray-400 text-xs ml-1">(강의에만 적용)</p>
            </div>

            {/* 적용 안내 */}
            <div className="mt-4 bg-[#EEF5FF] border border-[#AEDEFC] rounded-2xl px-4 py-3 text-sm text-[#439A97]">
                ℹ️ 쿠폰은 전체 패키지 금액 1,890,000원에 적용됩니다
            </div>

            {/* 쿠폰 선택 */}
            <div className="mt-5">
                <select className="w-full h-14 border border-[#E8EEF5] rounded-2xl px-4 outline-none">
                    <option>쿠폰 선택 (선택사항)</option>
                    <option>백 연동</option>
                </select>
            </div>

            {/* 경고 안내 */}
            <div className="mt-4 bg-[#FFF8E8] border border-[#F6C453] rounded-2xl px-4 py-3 text-sm text-[#D48806]">
                ⚠ 환불 시 쿠폰은 재발급되지 않습니다
            </div>
        </div>
    );
}