"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import QuizList from "./QuizList";
import QuizToolbar from "./QuizToolbar";
import { useAdminQuizList } from "../hooks/useAdminQuizList";
import { QuizManageClientProps } from "../types";
import SubHeader from "@/features/common/components/SubHeader";


export default function QuizManageClient({
  initialCourseId = "all",
}: QuizManageClientProps) {
  const {
    selectedLecture,
    setSelectedLecture,
    searchKeyword,
    setSearchKeyword,
    courses,
    filteredQuizzes,
    isLoading,
    errorMessage,
    refetch,
  } = useAdminQuizList(initialCourseId);
  const createHref =
    selectedLecture === "all"
      ? "/contentadmin/quiz/new"
      : `/contentadmin/quiz/new?courseId=${selectedLecture}`;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="quiz-management-title">
      <section aria-labelledby="quiz-management-title">
        <SubHeader
          backHref="/contentadmin/lecture"
          backText="강의관리로 돌아가기"
          title="퀴즈 관리"
          description="강의별 퀴즈를 등록하고 관리합니다."
        />
      </section>

      <section aria-label="퀴즈 검색 및 필터 영역">
        <QuizToolbar
          searchKeyword={searchKeyword}
          selectedLecture={selectedLecture}
          courses={courses}
          createHref={createHref}
          onSearchKeywordChange={setSearchKeyword}
          onSelectedLectureChange={setSelectedLecture}
        />
      </section>

      {isLoading && (
        <section
          aria-live="polite"
          className="mt-6 flex justify-center rounded-[18px] border border-[#E4E7EC] bg-white p-8"
        >
          <LoadingSpinner text="?? ??? ???? ????..." />
        </section>
      )}

      {!isLoading && <AdminErrorBanner message={errorMessage} className="mt-6" />}

      {!isLoading && !errorMessage && (
        <QuizList quizzes={filteredQuizzes} onDeleted={refetch} />
      )}
    </main>
  );
}
