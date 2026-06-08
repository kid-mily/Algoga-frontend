export default function LectureInfo() {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/book-active.svg" alt="책" />
                <h1 className="ml-2 font-bold">강의 정보</h1>
            </div>
            <div className="flex justify-between mt-3">
                <p className="text-[#0A1628] font-bold text-sm">사용자가 선택한 강의</p>
                <p className="font-bold text-[#0A1628] text-sm">얼마인지</p>
            </div>
        </div>
    );
}