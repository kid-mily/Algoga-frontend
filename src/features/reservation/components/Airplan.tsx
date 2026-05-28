export default function Airplane() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/AirplaneCyan.svg" alt="비행기" />
                <h1 className="ml-2 font-bold">항공권 정보</h1>
            </div>
            <div className="flex flex-col mt-3 gap-2">
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">항공사</p>
                    <p className="font-bold text-[#0A1628] text-sm">
                    항공사 어디인지 정보 받기
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">출발</p>
                    <p className="font-bold text-[#0A1628] text-sm">
                    인천 ICN → 2024.06.20 09:00
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">도착</p>
                    <p className="font-bold text-[#0A1628] text-sm">
                    도쿄 → 2024.06.20 11:30
                    </p>
                </div>
            </div>
        </div>
    );
}