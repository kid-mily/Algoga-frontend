export default function LearnMethod() {
    return (
        <section className="mt-5 w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#0A1628]">
            {/* aria-hidden="true": 스크린 리더가 이모지까지 읽지 않게 하기 위해서 */}
            <span aria-hidden="true">💡</span>     
            알고가 학습 방법
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="flex items-start gap-2 rounded-xl p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF5FF] text-xl">
                <span aria-hidden="true">📚</span>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0A1628]">단과 강의실</h3>
                <p className="text-sm leading-relaxed text-[#8A9BB0]">
                원하는 강의를 자유롭게 선택하여 학습할 수 있습니다.
                </p>
            </div>
            </article>

            <article className="flex items-start gap-2 rounded-xl p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E0] text-xl">
                <span aria-hidden="true">✈️</span>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0A1628]">패키지 라운지</h3>
                <p className="text-sm leading-relaxed text-[#8A9BB0]">
                진단 평가 후 맞춤 강의와 항공·숙소를 한번에 예약하세요.
                </p>
            </div>
            </article>
        </div>
        </section>
    );
}