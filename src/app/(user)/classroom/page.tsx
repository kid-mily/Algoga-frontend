// 클래스룸 (대륙 선택)

import ContinentHeader from "@/features/classroom/components/ContinentHeader";
import ContinentSelectForm from "@/features/classroom/components/ContinentSelectForm";
import LearnMethod from "@/features/main/components/LearningMethod";
import { getContinents } from "@/features/services/ContinentSelection.service";

export const revalidate = 1800;

export default async function ClassRoomMainPage() {
  const continents = await getContinents();

  return (
    <main className="min-h-screen w-full bg-[#F5F7FA] p-10">
      <ContinentHeader />

      <section className="mx-auto w-full max-w-4xl px-4">
        <ContinentSelectForm continents={continents} />
      </section>

      <section className="mx-auto mt-10 w-full max-w-4xl px-4">
        <LearnMethod />
      </section>
    </main>
  );
}