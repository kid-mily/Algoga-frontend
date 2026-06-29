import QuizCompleteClient from "@/features/classroom/quiz/components/QuizCompleteClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function QuizCompletePage() {
  return <QuizCompleteClient />;
}