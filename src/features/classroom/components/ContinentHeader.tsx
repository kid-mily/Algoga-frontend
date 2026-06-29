export default function ContinentHeader() {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-[#DDE8EF] bg-white px-6 py-7 shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#EEF8F7]" />
      <div className="pointer-events-none absolute right-10 bottom-6 h-12 w-12 rounded-full bg-[#FDD33B]/30" />

      <div className="relative flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#0A1628]">
            떠나고 싶은 대륙을 선택하세요
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718096]">
            여행지를 고르듯 대륙을 선택하고, 국가별 강의실에서 여행 표현을 학습해 보세요.
          </p>
        </div>

        <div className="hidden h-20 w-20 shrink-0 items-center justify-center text-3xl sm:flex">
          🧭
        </div>
      </div>
    </header>
  );
}