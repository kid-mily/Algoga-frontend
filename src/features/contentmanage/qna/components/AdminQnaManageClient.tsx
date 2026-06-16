"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useAdminQnaList } from "../hooks/useAdminQnaList";
import { AdminQnaItem, QnaStatusFilter } from "../types";
import AdminQnaRow from "./AdminQnaRow";

export default function AdminQnaManageClient() {
  const router = useRouter();
  const {
    currentQnas,
    filteredCount,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchKeyword,
    setStatusFilter,
  } = useAdminQnaList();

  const moveToDetail = (qna: AdminQnaItem) => {
    router.push(`/contentadmin/qna/${qna.id}/edit?courseId=${qna.courseId}`);
  };

  const moveToAnswer = (qna: AdminQnaItem) => {
    router.push(`/contentadmin/qna/${qna.id}?courseId=${qna.courseId}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SimpleSubHeader
        title="Q&A 관리"
        description="학생들의 질문을 관리하고 답변합니다"
      />

      <form
        role="search"
        className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
      >
        <fieldset className="flex items-center gap-3">
          <legend className="sr-only">Q&A 검색 및 상태 필터</legend>
          <label className="flex h-[44px] flex-1 items-center rounded-[14px] border border-[#E4E7EC] px-4">
            <img
              src="/images/search.svg"
              alt=""
              aria-hidden="true"
              className="h-[16px] w-[16px]"
            />
            <span className="sr-only">Q&A 검색어</span>
            <input
              type="text"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="질문 내용, 강의, 작성자 검색..."
              className="ml-3 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>
          <label>
            <span className="sr-only">답변 상태</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as QnaStatusFilter)
              }
              className="h-[44px] w-[120px] rounded-[14px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
            >
              <option value="all">전체</option>
              <option value="answered">답변 완료</option>
              <option value="waiting">답변 대기</option>
            </select>
          </label>
        </fieldset>
      </form>

      <AdminErrorBanner message={error} className="mt-4" />

      <section
        aria-labelledby="admin-qna-list-title"
        aria-busy={isLoading}
        className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white"
      >
        <h2 id="admin-qna-list-title" className="sr-only">
          관리자 Q&A 목록
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead className="border-b border-[#E4E7EC] bg-[#FCFCFD]">
              <tr>
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">강의</th>
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">질문</th>
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">작성자</th>
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">등록일</th>
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">상태</th>
                <th className="px-5 py-4 text-center text-[13px] font-semibold text-[#667085]">액션</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <LoadingSpinner text="Q&A 목록을 불러오는 중입니다..." />
                  </td>
                </tr>
              ) : currentQnas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[14px] text-[#667085]">
                    조회된 Q&A가 없습니다.
                  </td>
                </tr>
              ) : (
                currentQnas.map((qna) => (
                  <AdminQnaRow
                    key={`${qna.courseId}-${qna.id}`}
                    qna={qna}
                    onView={moveToDetail}
                    onAnswer={moveToAnswer}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between px-5 py-4">
          <p className="text-[14px] text-[#667085]">총 {filteredCount}개의 문의</p>
          <nav className="flex items-center gap-2" aria-label="Q&A 페이지네이션">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              이전
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[14px] font-semibold ${
                    currentPage === page
                      ? "bg-[#439A97] text-white"
                      : "border border-[#E4E7EC] bg-white text-[#667085]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              다음
            </button>
          </nav>
        </footer>
      </section>
    </main>
  );
}
