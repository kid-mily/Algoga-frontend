"use client";

import { useRouter } from "next/navigation";
import { EvalutionQuestion } from "../types";
import EvalutionDeleteModals from "./EvalutionDeleteModals";
import EvalutionFilterBar from "./EvalutionFilterBar";
import EvalutionQuestionList from "./EvalutionQuestionList";
import { useEvalutionQuestionList } from "../hooks/useEvalutionQuestionList";

type EvalutionManageClientProps = {
  initialQuestions: EvalutionQuestion[];
};

export default function EvalutionManageClient({
  initialQuestions,
}: EvalutionManageClientProps) {
  const router = useRouter();
  const {
    selectedLevel,
    selectedCountry,
    expandedId,
    filteredQuestions,
    deleteTarget,
    deleteCompleteOpen,
    error,
    setSelectedLevel,
    setSelectedCountry,
    setDeleteTarget,
    setDeleteCompleteOpen,
    toggleQuestion,
    deleteQuestion,
  } = useEvalutionQuestionList(initialQuestions);

  return (
    <main aria-labelledby="evalution-management-title">
      <header className="mb-6">
        <h1
          id="evalution-management-title"
          className="text-[26px] font-bold text-[#111827]"
        >
          진단평가 관리
        </h1>
        <p className="mt-2 text-[14px] text-[#667085]">
          사용자 수준을 파악하고 맞춤 강의를 추천하는 진단평가를 관리합니다
        </p>
      </header>

      {error && (
        <section
          role="alert"
          className="mb-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]"
        >
          {error}
        </section>
      )}

      <section
        aria-labelledby="evalution-question-management-title"
        className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white"
      >
        <h2 id="evalution-question-management-title" className="sr-only">
          진단평가 문제 관리
        </h2>

        <nav
          className="flex border-b border-[#E4E7EC]"
          aria-label="진단평가 관리 탭"
        >
          <button
            type="button"
            aria-current="page"
            className="border-b-2 border-[#439A97] px-6 py-4 text-[14px] font-semibold text-[#439A97]"
          >
            문제 관리
          </button>
          <button
            type="button"
            className="px-6 py-4 text-[14px] font-semibold text-[#667085]"
          >
            등급별 추천 강의 미리보기
          </button>
        </nav>

        <EvalutionFilterBar
          selectedLevel={selectedLevel}
          selectedCountry={selectedCountry}
          onSelectedLevelChange={setSelectedLevel}
          onSelectedCountryChange={setSelectedCountry}
          onCreateClick={() => router.push("/contentadmin/evalution/new")}
        />

        <EvalutionQuestionList
          questions={filteredQuestions}
          expandedId={expandedId}
          onToggle={toggleQuestion}
          onEdit={(questionId) =>
            router.push(`/contentadmin/evalution/${questionId}/edit`)
          }
          onDelete={setDeleteTarget}
        />
      </section>

      <EvalutionDeleteModals
        deleteTarget={deleteTarget}
        deleteCompleteOpen={deleteCompleteOpen}
        onConfirmDelete={deleteQuestion}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseComplete={() => setDeleteCompleteOpen(false)}
      />
    </main>
  );
}
