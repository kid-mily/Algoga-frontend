import SubHeader from "@/features/contentmanage/common/SubHeader";
import QuizForm from "./QuizForm";

export default function CreateQuizClient() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="create-quiz-title">
      <section aria-labelledby="create-quiz-title">
        <SubHeader
          backHref="/contentadmin/quiz"
          backText="퀴즈 목록으로 돌아가기"
          title="퀴즈 등록"
          description="새로운 퀴즈를 등록합니다."
        />
      </section>

      <section aria-label="퀴즈 등록 폼">
        <QuizForm mode="create" />
      </section>
    </main>
  );
}
