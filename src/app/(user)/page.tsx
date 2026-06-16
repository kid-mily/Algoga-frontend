import LearnMethod from "@/features/main/components/LearningMethod";
import NoticeSection from "@/features/main/components/NoticeSection";
import AiSchedule from "@/features/main/components/AiSchedule";
import Banner from "@/features/main/components/Banner";
import MapSection from "./main/MapSection";
import ScheduleCalendar from "@/features/main/components/ScheduleCalendar";
import { getMainNotices } from "@/features/services/notice.service";

export default async function Home() {
  // 메인 공지사항 데이터 조회
  const notices = await getMainNotices();

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] px-10 py-10">
      <h1 className="sr-only">메인 페이지</h1>

      <section className="mx-auto mb-5 max-w-4xl">
        <Banner />
      </section>

      <section className="mx-auto h-[500px] w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-lg">
        <MapSection />
      </section>

      <section className="mx-auto mt-5 w-full max-w-4xl">
        <ScheduleCalendar />

        <LearnMethod />

        <div className="mt-5 grid grid-cols-2 items-stretch gap-5">
          <NoticeSection />
          <AiSchedule />
        </div>
      </section>
    </main>
  );
}