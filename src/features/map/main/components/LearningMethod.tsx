export default function LearnMethod() {
    return (
        <div className="text-xl font-bold w-full h-[150px] mx-auto bg-[#FFFFFF] shadow-sm border border-gray-100 mt-5 rounded-2xl p-5">
            💡 알고가 학습 방법
            
            <div className="flex justify-between mt-8 ml-12 mr-12">
                {/* 단과 강의실 */}
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-[#EEF5FF] w-12 h-12 flex justify-center items-center">
                        📚
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[#0A1628]">단과 강의실</p>
                        <p className="text-sm text-[#8A9BB0]">원하는 강의를 자유롭게 선택하여 학습할 수 있습니다.</p>
                    </div>
                </div>

                {/* 패키지 라운지 */}
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-[#FFF3E0] w-12 h-12 flex justify-center items-center">
                        ✈️
                    </div>
                    <div>
                        <p className="text-lg font-bold text-[#0A1628]">패키지 라운지</p>
                        <p className="text-sm text-[#8A9BB0]">진단 평가 후 맞춤 강의와 항공·숙소를 한번에 예약하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}