import LearnMethod from "@/features/main/components/LearningMethod";
import NoticeSection from "@/features/main/components/NoticeSection";
import AiSchedule from "@/features/main/components/AiSchedule";
import Banner from "@/features/main/components/Banner";
import Calender from "@/features/main/components/ScheduleCalendar";
import MapSection from "./main/MapSection";

export default function Home() {
  return (
    <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
        
        {/* 베너 */}
        <div className="max-w-5xl mx-auto mb-5">
            <Banner/>
        </div>

      {/* 지도 */}
      <div className="max-w-5xl w-full h-[500px] border rounded-xl overflow-hidden shadow-lg bg-white mx-auto">
        <MapSection />
      </div>

      {/* 아래 영역 */}
      {/* 학습방법 */}
      <div className="max-w-5xl w-full mx-auto mt-5">
        <Calender/>
        <LearnMethod />
        {/* 공지사항, ai 일정 추천 */}
        <div className="mt-5 gap-5 flex justify-between">
          <NoticeSection />
          <AiSchedule />
        </div>
      </div>
    </div>
  );
}