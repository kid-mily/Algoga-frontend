import type { ItineraryResponse } from "../types";

interface ItineraryResultViewProps {
  itinerary: ItineraryResponse;
}

// 일정 추천 결과: 상단 요약 + 예상 비용 + 일자별 오전/오후/저녁 카드 + AI 코멘트
export default function ItineraryResultView({
  itinerary,
}: ItineraryResultViewProps) {
  const { estimatedCost } = itinerary;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[360px_1fr] lg:items-start">
        <div className="space-y-5 lg:sticky lg:top-6">
          <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
              AI ITINERARY
            </span>
            <h2 className="mt-1 text-lg font-extrabold text-[#0A1628]">
              {itinerary.destination}
            </h2>
            <p className="mt-1 text-xs text-[#718096]">
              {itinerary.startDate} ~ {itinerary.endDate} ·{" "}
              {itinerary.totalDays}일 · {itinerary.headcount}명
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F3F8FC] px-3 py-1 text-xs font-bold text-[#0A1628]">
                {itinerary.purposeLabel}
              </span>
              <span className="rounded-full bg-[#F3F8FC] px-3 py-1 text-xs font-bold text-[#0A1628]">
                {itinerary.companionLabel}
              </span>
              {itinerary.preferences.map((preference) => (
                <span
                  key={preference.code}
                  className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-bold text-[#439A97]"
                >
                  {preference.label}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5">
            <h3 className="text-sm font-bold text-[#0A1628]">예상 비용</h3>
            <div className="mt-3 space-y-2 text-sm">
              {estimatedCost.packagePrice !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-[#718096]">패키지/예약 금액</span>
                  <span className="font-bold text-[#0A1628]">
                    {estimatedCost.packagePrice.toLocaleString()}원
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#718096]">예상 식비</span>
                <span className="font-bold text-[#0A1628]">
                  {estimatedCost.foodCost.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-2">
                <span className="font-bold text-[#0A1628]">예상 총비용</span>
                <span className="text-base font-extrabold text-[#439A97]">
                  {estimatedCost.totalEstimated.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8A9BB0]">
                <span>입력하신 예산</span>
                <span>{itinerary.budget.toLocaleString()}원</span>
              </div>
            </div>
          </section>

          {itinerary.comment && (
            <section className="hidden rounded-2xl bg-[#EEF8F7] p-4 text-sm leading-6 text-[#0A1628] lg:block">
              {itinerary.comment}
            </section>
          )}
        </div>

        <section className="space-y-4">
          {itinerary.days.map((day) => (
            <div
              key={day.day}
              className="rounded-2xl border border-[#E1E8EF] bg-white p-5"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#439A97] px-2.5 py-1 text-xs font-extrabold text-white">
                  Day {day.day}
                </span>
                <span className="text-xs text-[#8A9BB0]">{day.date}</span>
              </div>

              <div className="mt-3 space-y-3">
                {day.slots.map((slot, index) => (
                  <div
                    key={`${day.day}-${index}`}
                    className="flex gap-3 border-t border-dashed border-[#D6E0E8] pt-3 first:border-t-0 first:pt-0"
                  >
                    <span className="w-12 shrink-0 text-xs font-bold text-[#439A97]">
                      {slot.time}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0A1628]">
                        {slot.activity}
                      </p>
                      <p className="mt-0.5 text-xs text-[#718096]">
                        {slot.place}
                      </p>
                      {slot.memo && (
                        <p className="mt-0.5 text-xs text-[#A0AEC0]">
                          {slot.memo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {itinerary.comment && (
        <section className="rounded-2xl bg-[#EEF8F7] p-4 text-sm leading-6 text-[#0A1628] lg:hidden">
          {itinerary.comment}
        </section>
      )}
    </div>
  );
}
