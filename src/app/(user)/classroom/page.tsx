// 대륙선택 (강의실 메인)
import ContinentSelectForm from "@/features/classroom/components/ContinentSelectForm";
import LearnMethod from "@/features/main/learningmethod/LearningMethod";
import { getContinents } from "@/features/services/ContinentSelection.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "강의실",
  description: "국가별 여행 강의를 선택하고 여행 전 필요한 학습을 시작하세요.",
  openGraph: {
    title: "강의실 | ALGOGA",
    description: "국가별 여행 강의를 선택하고 여행 전 필요한 학습을 시작하세요.",
    url: "/classroom",
    images: [
      {
        url: "/images/og-image.png",
        width: 1100,
        height: 740,
        alt: "ALGOGA 강의실",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "강의실 | ALGOGA",
    description: "국가별 여행 강의를 선택하고 여행 전 필요한 학습을 시작하세요.",
    images: ["/images/og-image.png"],
  },
};

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