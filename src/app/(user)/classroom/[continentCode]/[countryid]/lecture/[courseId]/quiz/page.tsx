import QuizClient from "@/features/classroom/quiz/components/QuizClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function QuizPage() {
  return (
    <QuizClient
      initialCourseTitle=""
      description="학습 내용을 바탕으로 출제된 문제를 풀어보세요."
    />
  );
}