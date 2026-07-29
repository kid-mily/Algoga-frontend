import { redirect } from "next/navigation";
import QuizClient from "@/features/classroom/quiz/components/QuizClient";
import { loadCourseQuiz } from "@/features/classroom/quiz/actions";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";
import { ApiRequestError } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface QuizPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { courseId } = await params;

  let initialData: Awaited<ReturnType<typeof loadCourseQuiz>> | null = null;
  let loadError: unknown = null;

  try {
    initialData = await loadCourseQuiz(
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
    console.error("[quiz] 퀴즈 조회 실패:", loadError);

    return (
      <main className="flex h-[calc(100dvh-64px)] items-center justify-center bg-[#F3F8FC]">
        <section className="flex h-[420px] max-w-md flex-col items-center justify-center rounded-2xl border border-[#E1E8EF] bg-white px-8 text-center shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4E8] text-lg font-bold text-[#A87512]">
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
            퀴즈를 불러올 수 없습니다.
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {loadError instanceof Error
              ? loadError.message
              : "퀴즈를 불러오지 못했습니다."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <QuizClient
      key={courseId}
      description="학습 내용을 바탕으로 출제된 문제를 풀어보세요."
      initialData={initialData}
    />
  );
}