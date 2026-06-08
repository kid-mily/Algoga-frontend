export default function PeopleInfo() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/UserCyan.svg" alt="사람" />
                <h1 className="ml-2 font-bold">인원 정보</h1>
            </div>
            <div className="flex flex-col mt-3 gap-2">
                <div className="flex justify-between">
                    <p className="text-[#8A9BB0] font-bold text-xs">예약 인원</p>
                    <p className="font-bold text-[#0A1628] text-sm">1명</p>
                </div>
            </div>
        </div>
    );
}