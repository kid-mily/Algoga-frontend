// 클래스룸 (대륙 선택)

import ContinentHeader from "@/features/classroom/ContinentHeader";
import ContinentSelectForm from "@/features/classroom/ContinentSelectForm";
import LearnMethod from "@/features/main/components/LearningMethod";

export default function ClassRoomMainPage() {
  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-10">
      <ContinentHeader/>
      <ContinentSelectForm />
      <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4 mt-12">
          <LearnMethod />
        </div>
    </div>
  );
}