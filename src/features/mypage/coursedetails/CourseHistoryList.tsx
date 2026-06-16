import Link from "next/link";

interface CourseHistoryItem {
  id: number;
  flag: string;
  title: string;
  progress: number;
  completed?: boolean;
}

const courseHistoryItems: CourseHistoryItem[] = [
  {
    id: 1,
    flag: "🇯🇵",
    title: "일본 여행 완벽 가이드",
    progress: 100,
    completed: true,
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
      {courseHistoryItems.map((course) => {
        const progress = Math.min(Math.max(course.progress, 0), 100);

        return (
          <article
            key={course.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex gap-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {course.flag}
                  </span>

                  <h2 className="truncate text-sm font-bold text-gray-900">
                    {course.title}
                  </h2>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-400">
                      진도율
                    </span>

                    <span className="font-bold text-[#43A6A2]">
                      {progress}%
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-sky-100"
                    role="progressbar"
                    aria-label={`${course.title} 진도율`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full rounded-full bg-[#43A6A2]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {course.completed ? (
                <div className="flex w-28 shrink-0 flex-col gap-2">
                  <span className="self-end rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                    수료
                  </span>

                  <Link
                    href={`/mypage/courses/${course.id}/certificate`}
                    className="flex h-9 items-center justify-center rounded-xl bg-[#43A6A2] text-xs font-bold text-white hover:bg-[#357F7C]"
                  >
                    수료증 보기
                  </Link>

                  <Link
                    href={`/mypage/reservations/new?courseId=${course.id}`}
                    className="flex h-9 items-center justify-center rounded-xl bg-orange-600 text-xs font-bold text-white hover:bg-orange-700"
                  >
                    패키지 예약
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/mypage/courses/${course.id}`}
                  aria-label={`${course.title} 상세 보기`}
                  className="mt-1 shrink-0 text-xl text-gray-300 hover:text-[#43A6A2]"
                >
                  ›
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}