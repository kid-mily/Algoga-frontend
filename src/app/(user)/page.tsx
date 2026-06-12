// 메인 페이지

import LearnMethod from "@/features/main/components/LearningMethod";
import NoticeSection from "@/features/main/components/NoticeSection";
import AiSchedule from "@/features/main/components/AiSchedule";
import Banner from "@/features/main/components/Banner";
import Calender from "@/features/main/components/ScheduleCalendar";
import MapSection from "./main/MapSection";
import { getMainNotices } from "@/features/services/notice.service";
import { getMethodSchedules } from "@/features/services/schedule.service";

// 30분 마다 페이지 재생성
export const revalidate = 1800;

// 현재 년/월 반환
const getCurrentYearMonth = () => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

export default async function Home() {
  const { year, month } = getCurrentYearMonth();

  const [ notices, schedules] = await Promise.all([ 
    getMainNotices(),
    getMethodSchedules(year, month),
  ]);

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] px-10 py-10">
      <h1 className="sr-only">메인 페이지</h1>

      {/* 메인 배너 영역 */}
      <section className="mx-auto mb-5 max-w-4xl">
        <Banner/>
      </section>

      {/* 지도 */}
      <section
        className="mx-auto h-[500px] w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-lg"
      >
        <MapSection />
      </section>

      {/* 메인 컨텐츠 영역 */}
      <section className="mx-auto mt-5 w-full max-w-4xl">

        {/* 캘린더 */}
        <Calender
          initialYear={year}
          initialMonth={month}
          initialSchedules={schedules}
        />

        {/* 학습 방법 */}
        <LearnMethod />

        {/* 공지사항 및 Ai 일정 추천 */}
        <div className="mt-5 flex justify-between gap-5">
          <NoticeSection notices={notices} />
          <AiSchedule />
        </div>
      </section>
    </main>
  );
}