"use client";

interface CourseHistoryItem {
  id: number;
  flag: string;
  title: string;
  progress: number;
  completed?: boolean;
  showActions?: boolean;
}

const courseHistoryItems: CourseHistoryItem[] = [
  {
    id: 1,
    flag: "🇯🇵",
    title: "일본 여행 완벽 가이드",
    progress: 100,
    completed: true,
    showActions: true,
  },
  {
    id: 2,
    flag: "🇫🇷",
    title: "프랑스 문화와 여행",
    progress: 65,
  },
  {
    id: 3,
    flag: "🇺🇸",
    title: "미국 동부 여행 준비",
    progress: 30,
  },
];

export default function CourseHistoryList() {
  return (
    <section aria-label="수강 내역 목록" className="space-y-4">
      {courseHistoryItems.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-[#E5EDF5] bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {item.flag}
                </span>

                <h2 className="truncate text-sm font-bold text-[#0A1628]">
                  {item.title}
                </h2>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#8A9BB0]">진도율</span>
                  <span className="text-[#439A97]">
                    {item.progress}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#CDEEFF]">
                  <div
                    className="h-full rounded-full bg-[#43A6A2]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {item.showActions ? (
              <div className="flex w-28 shrink-0 flex-col gap-2">
                <span className="self-end rounded-full bg-[#62BF73] px-3 py-1 text-[11px] font-bold text-white">
                  수료
                </span>

                <button
                  type="button"
                  className="h-9 rounded-xl bg-[#43A6A2] text-xs font-bold text-white transition hover:bg-[#357F7C]"
                >
                  수료증 보기
                </button>

                <button
                  type="button"
                  className="h-9 rounded-xl bg-[#E85D04] text-xs font-bold text-white transition hover:bg-[#C94F03]"
                >
                  패키지 예약
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label={`${item.title} 상세 보기`}
                className="mt-1 shrink-0 text-xl leading-none text-[#B8C4D0] transition hover:text-[#439A97]"
              >
                ›
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}