import LearnMethod from "@/features/main/components/LearningMethod";
import NoticeSection from "@/features/main/components/NoticeSection";
import AiSchedule from "@/features/main/components/AiSchedule";
import Banner from "@/features/main/components/Banner";
import MapSection from "./main/MapSection";
import { getMainNotices } from "@/features/services/notice.service";
import ScheduleCalendar from "@/features/main/components/ScheduleCalendar";

export default async function Home() {
  try {
    await getMainNotices();
  } catch (error) {
    console.error("[home] 메인 공지 조회 실패:", error);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F3F8FC] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <h1 className="sr-only">알고가 메인 페이지</h1>

      <div className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rounded-full bg-[#DDEFF3]/60" />
      <div className="pointer-events-none absolute -right-32 top-[720px] h-80 w-80 rounded-full bg-[#E8F3E8]/70" />
      <div className="pointer-events-none absolute -left-28 top-[1200px] h-72 w-72 rounded-full bg-[#DDEFF3]/60" />

      <div className="relative">
        <section className="mx-auto flex h-[calc(100dvh-88px)] w-full max-w-6xl flex-col">
          <header className="mb-3 flex shrink-0 flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] sm:text-3xl">
                여행지를 선택하고 학습을 시작하세요
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-[#7C8A9A]">
                관심 있는 국가를 지도에서 선택하고 여행에 필요한 강의와 정보를 확인해 보세요.
              </p>
            </div>
          </header>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-[#DCE8EF] bg-white shadow-[0_16px_50px_rgba(55,88,110,0.12)]">
            <MapSection />
          </div>
        </section>

        <section className="mx-auto mt-5 w-full max-w-6xl">
          <Banner />
        </section>

        <section className="mx-auto mt-5 w-full max-w-6xl">
          <header className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#439A97]">
                MY TRAVEL DASHBOARD
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0A1628]">
                나의 여행 학습 플래너
              </h2>

              <p className="mt-1 text-sm text-[#8A94A6]">
                여행 준비와 학습 일정을 한눈에 관리해 보세요.
              </p>
            </div>
          </header>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <ScheduleCalendar />

            <aside className="flex min-w-0 flex-col gap-4 self-start">
              <NoticeSection />
              <AiSchedule />
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-5 w-full max-w-6xl">
          <LearnMethod />
        </section>
      </div>
    </main>
  );
}