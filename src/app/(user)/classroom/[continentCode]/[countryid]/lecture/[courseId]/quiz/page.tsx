import QuizClient from "@/features/classroom/quiz/components/QuizClient";

export default function QuizPage() {
  return (
    <QuizClient
      initialCourseTitle=""
      description="학습 내용을 바탕으로 출제된 모든 문제를 풀어 주세요."
    />
  );
}