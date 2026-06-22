import LearnMethod from "@/features/main/components/LearningMethod";
import NoticeSection from "@/features/main/components/NoticeSection";
import AiSchedule from "@/features/main/components/AiSchedule";
import Banner from "@/features/main/components/Banner";
import MapSection from "./main/MapSection";
import ScheduleCalendar from "@/features/main/components/ScheduleCalendar";
import { getMainNotices } from "@/features/services/notice.service";

export default async function Home() {
  const notices = await getMainNotices();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F8FC] px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="sr-only">알고가 메인 페이지</h1>

      {/* 배경 장식 */}
      <div className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rounded-full bg-[#DDEFF3]/60" />
      <div className="pointer-events-none absolute -right-32 top-[720px] h-80 w-80 rounded-full bg-[#E8F3E8]/70" />
      <div className="pointer-events-none absolute -left-28 top-400 h-72 w-72 rounded-full bg-[#DDEFF3]/60" />

      <div className="relative">
        {/* 여행 지도 */}
        <section className="mx-auto w-full max-w-[1440px]">
          <header className="mb-4 flex flex-col justify-between gap-4 px-1 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E5F3F2] px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#439A97]">
                  EXPLORE & LEARN
                </span>
                <span aria-hidden="true" className="text-lg">✈</span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-[#0A1628] sm:text-3xl">
                여행지를 선택하고 학습을 시작하세요
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7C8A9A]">
                관심 있는 국가를 지도에서 선택하고 여행에 필요한 강의와 정보를 확인해 보세요.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-[#DDE7ED] bg-white px-4 py-2 text-xs font-medium text-[#667085] shadow-sm sm:flex">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#439A97]" />
              국가를 클릭해 여행 학습을 시작하세요
            </div>
          </header>

          <div className="relative h-[520px] w-full overflow-hidden rounded-[28px] border border-[#DCE8EF] bg-white shadow-[0_16px_50px_rgba(55,88,110,0.12)] sm:h-[580px] lg:h-[640px]">
            {/* 지도 안내 카드 */}
            <div className="pointer-events-none absolute left-5 top-5 z-10 hidden rounded-[18px] border border-white/80 bg-white/90 px-4 py-3 shadow-md backdrop-blur-sm sm:block">
              <p className="text-[10px] font-bold tracking-[0.14em] text-[#439A97]">
                SELECT DESTINATION
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span aria-hidden="true">🧭</span>
                <p className="text-sm font-bold text-[#0A1628]">어디로 떠나시나요?</p>
              </div>

              <p className="mt-1 text-xs text-[#8A94A6]">
                국가를 선택하면 맞춤 강의를 확인할 수 있어요.
              </p>
            </div>

            <MapSection />
          </div>
        </section>

        {/* 메인 배너 */}
        <section className="mx-auto mt-6 w-full max-w-6xl">
          <Banner />
        </section>

        {/* 여행 학습 대시보드 */}
        <section className="mx-auto mt-6 w-full max-w-6xl">
          <header className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#439A97]">
                MY TRAVEL DASHBOARD
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0A1628]">
                나의 여행 학습 플래너
              </h2>
              <p className="mt-1 text-sm text-[#8A94A6]">
                여행 준비와 학습 일정을 한곳에서 관리해 보세요.
              </p>
            </div>

            <span className="hidden rounded-full bg-[#EAF5F4] px-3 py-1.5 text-xs font-semibold text-[#439A97] md:block">
              PLAN · LEARN · TRAVEL
            </span>
          </header>

          {/* 캘린더와 우측 사이드바 그리드 */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              <ScheduleCalendar />

            <aside className="flex min-w-0 flex-col gap-5">
                <NoticeSection />

                <AiSchedule />
            </aside>
          </div>
        </section>

        {/* 학습 방법 */}
        <section className="mx-auto mt-8 w-full max-w-6xl">
          <header className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#439A97]">
                LEARNING JOURNEY
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0A1628]">
                여행을 완성하는 학습 여정
              </h2>
              <p className="mt-1 text-sm text-[#8A94A6]">
                여행지 선택부터 강의 수료까지 단계별로 준비해 보세요.
              </p>
            </div>
          </header>

            <LearnMethod />
        </section>
      </div>
    </main>
  );
}