export default function PackMileageForm() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/point-active.svg" alt="마일리지" />
                    <h1 className="ml-2 font-bold">마일리지 사용</h1>
                    <p className="text-gray-400 text-xs ml-1">(강의에만 적용)</p>
                </div>
                    <p className="text-[#439A97] font-bold">보유: 15,000원</p>
            </div>
            
            {/* 적용 안내 */}
            <div className="mt-4 bg-[#EEF5FF] border border-[#AEDEFC] rounded-2xl px-4 py-3 text-sm text-[#439A97]">
                ℹ️ 마일리지는 쿠폰 적용 후 강의 금액에만 사용할 수 있습니다
            </div>
            
            <div className="mt-5 flex gap-3">

                <input 
                    type="number"
                    placeholder="사용할 마일리지를 입력해주세요"
                    className="flex-1 h-14 border border-[#E8EEF5] rounded-2xl px-4 outline-none"
                />

                <button className="w-28 h-14 bg-[#439A97] text-white font-semibold rounded-2xl">
                    사용하기
                </button>
            </div>
            <p className="text-sm text-[#8A9BB0] mt-3 ml-3">
                쿠폰 적용 후 남은 금액 내에서 최대 15,000원까지 사용 가능합니다
            </p>
            <div className="mt-4 bg-[#EEF7FF] border border-[#7DB8FF] rounded-2xl px-4 py-3 text-sm text-[#1D6FD8]">
                ✓ 환불 시 사용한 마일리지는 전액 반환됩니다
            </div>
        </div>
    )

}