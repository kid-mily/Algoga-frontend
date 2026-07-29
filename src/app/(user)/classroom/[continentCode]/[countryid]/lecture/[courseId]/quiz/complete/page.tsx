import QuizCompleteClient from "@/features/classroom/quiz/components/QuizCompleteClient";
import { loadQuizCompleteResult } from "@/features/classroom/quiz/actions";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface QuizCompletePageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function QuizCompletePage({
  params,
}: QuizCompletePageProps) {
  const { courseId } = await params;

  const initialData = await loadQuizCompleteResult(
    courseId,
    undefined,
    await getServerAuthHeaders()
  ).catch((error) => {
    console.error("[quiz-complete] 퀴즈 결과 조회 실패:", error);
    return null;
  });

  return <QuizCompleteClient key={courseId} initialData={initialData} />;
}