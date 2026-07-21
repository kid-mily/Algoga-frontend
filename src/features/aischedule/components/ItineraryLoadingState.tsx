// AI 생성은 수 초~수십 초 걸릴 수 있어(최대 60초) 전용 로딩 화면을 보여준다
export default function ItineraryLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E1E8EF] bg-white px-6 py-16 text-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#EEF8F7] border-t-[#439A97]" />
      <p className="mt-4 text-sm font-bold text-[#0A1628]">
        AI가 여행 일정을 만들고 있습니다...
      </p>
      <p className="mt-1 text-xs text-[#8A9BB0]">
        최대 1분 정도 걸릴 수 있어요. 잠시만 기다려 주세요.
      </p>
    </div>
  );
}
