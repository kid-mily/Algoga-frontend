export default function LearnMethod() {
    return (
        <div className="w-full mt-5 bg-[#FFFFFF] shadow-sm border border-gray-100 rounded-2xl p-6">
        {/* 타이틀 영역 */}
        <h3 className="text-xl font-bold text-[#0A1628] flex items-center gap-2 mb-6">
            <span>💡</span> 알고가 학습 방법
        </h3>
        
        {/* 컨텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 단과 강의실 */}
            <div className="flex items-start gap-4 p-4 rounded-xl">
                <div className="shrink-0 rounded-2xl bg-[#EEF5FF] w-12 h-12 flex justify-center items-center text-xl">
                    📚
                </div>
                <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#0A1628]">단과 강의실</h4>
                    <p className="text-sm text-[#8A9BB0] leading-relaxed">
                        원하는 강의를 자유롭게 선택하여 학습할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 패키지 라운지 */}
            <div className="flex items-start gap-4 p-4 rounded-xl">
                <div className="shrink-0 rounded-2xl bg-[#FFF3E0] w-12 h-12 flex justify-center items-center text-xl">
                    ✈️
                </div>
                <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#0A1628]">패키지 라운지</h4>
                    <p className="text-sm text-[#8A9BB0] leading-relaxed">
                        진단 평가 후 맞춤 강의와 항공·숙소를 한번에 예약하세요.
                    </p>
                </div>
            </div>
        </div>
    </div>
    );
}