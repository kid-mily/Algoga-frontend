import ContinentSelectForm from "@/features/classroom/components/ContinentSelectForm";
import LearnMethod from "@/features/main/learningmethod/LearningMethod";
import { getContinents } from "@/features/services/ContinentSelection.service";

export default async function ClassRoomMainPage() {
  const continents = await getContinents();

  return (
    <main className="min-h-screen w-full bg-[#F3F8FC] px-4 pb-14 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <section className="mt-6">
          <ContinentSelectForm continents={continents} />
        </section>

        <section className="mt-10">
          <LearnMethod />
        </section>
      </div>
    </main>
  );
}