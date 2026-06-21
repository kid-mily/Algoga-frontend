// 그 나라에 해당하는 강의 목록 페이지 (단과/패키지)

import LectureGrid from "@/features/classroom/components/LectureGrid";
import LecturePageHeader from "@/features/classroom/components/LecturePageHeader";
import EvaluationBanner from "@/features/classroom/components/EvaluationBanner";
import { getCourses } from "@/features/services/lectureSelect.service";

export const revalidate = 3;    // 300

interface LectureListPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export default async function LectureListPage({
  params,
}: LectureListPageProps) {
  const { continentCode, countryid } = await params;

  const lectures = await getCourses(countryid);

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] p-10">
      <section className="mx-auto w-full max-w-3xl px-4">
        <LecturePageHeader continentCode={continentCode} />

        <EvaluationBanner continentCode={continentCode} countryId={countryid} />

        <section aria-labelledby="lecture-list-title" className="mt-8">
          <h2 id="lecture-list-title" className="sr-only">
            강의 목록
          </h2>

          <LectureGrid
            lectures={lectures}
            continentCode={continentCode}
            countryId={countryid}
          />
        </section>
      </section>
    </main>
  );
}