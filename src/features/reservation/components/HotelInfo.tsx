export default function HotelInfo() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/HotelCyan.svg" alt="호텔" />
                <h1 className="ml-2 font-bold">숙소 정보</h1>
            </div>
            <div className="flex flex-col mt-3 gap-2">
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">호텔</p>
                    <p className="font-bold text-[#0A1628] text-sm">도톤보리 엑셀 호텔</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">객실 타입</p>
                    <p className="font-bold text-[#0A1628] text-sm">스탠다드 더블</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">체크인</p>
                    <p className="font-bold text-[#0A1628] text-sm">2026.06.20</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">체크아웃</p>
                    <p className="font-bold text-[#0A1628] text-sm">2026.06.23</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">숙박 일수</p>
                    <p className="font-bold text-[#0A1628] text-sm">3박 4일</p>
                </div>
            </div>
        </div>
    );
}