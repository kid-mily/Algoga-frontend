"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import { useRouter } from "next/navigation";
import EvalutionDeleteModals from "./EvalutionDeleteModals";
import EvalutionFilterBar from "./EvalutionFilterBar";
import EvalutionPagination from "./EvalutionPagination";
import EvalutionQuestionList from "./EvalutionQuestionList";
import EvalutionResultTable from "./EvalutionResultTable";
import { useEvalutionQuestionList } from "../hooks/useEvalutionQuestionList";

export default function EvalutionManageClient() {
  const router = useRouter();
  const {
    activeTab,
    results,
    currentResultPage,
    resultTotalPages,
    setCurrentResultPage,
    countries,
    selectedCountryId,
    expandedId,
    filteredQuestionSets,
    deleteTarget,
    deleteCompleteOpen,
    isLoadingQuestions,
    isLoadingResults,
    isProcessing,
    error,
    setActiveTab,
    setSelectedCountryId,
    setDeleteTarget,
    setDeleteCompleteOpen,
    toggleQuestionSet,
    deleteQuestion,
  } = useEvalutionQuestionList();

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

      <AdminErrorBanner message={error} className="mb-4" />

      <section
        aria-labelledby="evalution-question-management-title"
        className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white"
      >
        <h2 id="evalution-question-management-title" className="sr-only">
          진단평가 문제 관리
        </h2>

        <nav
          role="tablist"
          className="flex border-b border-[#E4E7EC]"
          aria-label="진단평가 관리 탭"
        >
          <button
            id="evalution-questions-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "questions"}
            aria-controls="evalution-questions-panel"
            onClick={() => setActiveTab("questions")}
            className={`px-6 py-4 text-[14px] font-semibold ${
              activeTab === "questions"
                ? "border-b-2 border-[#439A97] text-[#439A97]"
                : "text-[#667085]"
            }`}
          >
            문제 관리
          </button>
          <button
            id="evalution-results-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "results"}
            aria-controls="evalution-results-panel"
            onClick={() => setActiveTab("results")}
            className={`px-6 py-4 text-[14px] font-semibold ${
              activeTab === "results"
                ? "border-b-2 border-[#439A97] text-[#439A97]"
                : "text-[#667085]"
            }`}
          >
            응답 결과
          </button>
        </nav>

        {activeTab === "questions" ? (
          <div
            id="evalution-questions-panel"
            role="tabpanel"
            aria-labelledby="evalution-questions-tab"
          >
            <EvalutionFilterBar
              countries={countries}
              selectedCountryId={selectedCountryId}
              onSelectedCountryChange={setSelectedCountryId}
              onCreateClick={() => router.push("/contentadmin/evalution/new")}
            />

            <EvalutionQuestionList
              questionSets={filteredQuestionSets}
              isLoading={isLoadingQuestions}
              expandedId={expandedId}
              onToggle={toggleQuestionSet}
              onEdit={(questionId) =>
                router.push(`/contentadmin/evalution/${questionId}/edit`)
              }
              onDelete={setDeleteTarget}
            />
          </div>
        ) : (
          <div
            id="evalution-results-panel"
            role="tabpanel"
            aria-labelledby="evalution-results-tab"
          >
            <EvalutionResultTable
              results={results}
              isLoading={isLoadingResults}
            />

            {!isLoadingResults && resultTotalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <EvalutionPagination
                  currentPage={currentResultPage}
                  totalPages={resultTotalPages}
                  onPageChange={setCurrentResultPage}
                />
              </div>
            )}
          </div>
        )}
      </section>

      <EvalutionDeleteModals
        deleteTarget={deleteTarget}
        deleteCompleteOpen={deleteCompleteOpen}
        isProcessing={isProcessing}
        onConfirmDelete={deleteQuestion}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseComplete={() => setDeleteCompleteOpen(false)}
      />
    </main>
  );
}
