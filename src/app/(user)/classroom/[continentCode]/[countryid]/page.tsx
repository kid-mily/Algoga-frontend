import LectureGrid from "@/features/classroom/components/LectureGrid";
import LecturePageHeader from "@/features/classroom/components/LecturePageHeader";
import EvaluationBanner from "@/features/classroom/components/EvaluationBanner";
import type { CourseItem } from "@/features/classroom/components/types";
import { getCourses } from "@/features/services/lectureSelect.service";

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

  let lectures: CourseItem[] = [];

  try {
    lectures = await getCourses(countryid);
  } catch (error) {
    console.error("[lecture-list] 강의 목록 조회 실패:", error);
    lectures = [];
  }

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