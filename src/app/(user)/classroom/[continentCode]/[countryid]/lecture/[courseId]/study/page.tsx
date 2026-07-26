import Link from "next/link";
import { redirect } from "next/navigation";
import LectureStudyClient from "@/features/classroom/study/components/LectureStudyClient";
import { loadLectureStudy } from "@/features/classroom/study/actions";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";
import { ApiRequestError } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LectureStudyPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function LectureStudyPage({
  params,
}: LectureStudyPageProps) {
  const { continentCode, countryid, courseId } = await params;
  const lectureHref = `/classroom/${continentCode}/${countryid}/lecture/${courseId}`;

  let initialData: Awaited<ReturnType<typeof loadLectureStudy>> | null = null;
  let loadError: unknown = null;

  try {
    initialData = await loadLectureStudy(
      courseId,
      undefined,
      await getServerAuthHeaders()
    );
  } catch (error) {
    loadError = error;
  }

  if (loadError instanceof ApiRequestError && loadError.status === 401) {
    redirect("/auth/login");
  }

  if (!initialData) {
    console.error("[study] 강의 학습 정보 조회 실패:", loadError);

    return (
      <main className="flex h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FB]">
        <section className="rounded-[20px] bg-white p-6 text-center shadow-sm">
          <h1 className="font-bold text-[#0A1628]">
            강의를 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {loadError instanceof Error
              ? loadError.message
              : "강의 정보를 불러오지 못했습니다."}
          </p>

          <Link
            href={lectureHref}
            className="mt-4 inline-flex rounded-[14px] bg-[#5E9F9B] px-4 py-2.5 text-sm font-bold text-white"
          >
            강의 상세로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  return <LectureStudyClient key={courseId} initialData={initialData} />;
}