"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { downloadInterestLecturesCsv } from "@/features/services/adminInterestStatistics.service";
import type { CourseCompletionAnalysisTableProps } from "../types";
import { getCompletionStatusStyle } from "../utils";

const PAGE_SIZE = 10;

export default function CourseCompletionAnalysisTable({
  data,
  keyword,
  isLoading = false,
  onKeywordChange,
}: CourseCompletionAnalysisTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 새 검색 결과가 오면 1페이지로 되돌립니다.
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, safeCurrentPage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-[18px] font-bold text-[#111827]">
        <span className="h-6 w-1 rounded-full bg-[#8173E8]" />
        강의별 수강률 분석
      </h2>

      <article className="mt-5 overflow-hidden rounded-[18px] bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[14px] font-bold text-[#111827]">
              강의별 수강 현황
            </h3>
            <div className="flex items-center gap-3 text-[12px] text-[#98A2B3]">
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#2FAE9B]" />
                정상 ≥60%
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#F59E0B]" />
                주의 30~59%
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#EF4444]" />
                위험 &lt;30%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex h-9 w-[180px] items-center rounded-[10px] border border-[#E4E7EC] px-3">
              <Search size={14} className="text-[#98A2B3]" />
              <span className="sr-only">강의명 검색</span>
              <input
                type="text"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="강의명 검색..."
                className="ml-2 w-full bg-transparent text-[12px] outline-none placeholder:text-[#98A2B3]"
              />
            </label>

            <button
              type="button"
              onClick={() => void downloadInterestLecturesCsv(keyword)}
              className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
            >
              <Download size={14} />
              CSV
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] table-fixed border-collapse">
            <thead className="bg-[#F7F8FA]">
              <tr className="text-left text-[12px] font-semibold text-[#667085]">
                <th className="w-[30%] px-5 py-3">강의명</th>
                <th className="w-[20%] px-5 py-3">수강생 수</th>
                <th className="w-[30%] px-5 py-3">평균 진도율</th>
                <th className="w-[20%] px-5 py-3">수료율</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-[13px] text-[#98A2B3]"
                  >
                    강의별 수강 현황을 불러오는 중입니다...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-[13px] text-[#98A2B3]"
                  >
                    조회된 강의별 수강 현황이 없습니다.
                  </td>
                </tr>
              ) : (
                pagedData.map((course) => {
                  const status = getCompletionStatusStyle(course.completionStatus);

                  return (
                    <tr
                      key={course.courseId}
                      className="border-b border-[#EEF0F3] text-[13px] text-[#111827]"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {course.courseTitle}
                      </td>
                      <td className="px-5 py-4 text-[#98A2B3]">
                        {course.enrollmentCount.toLocaleString()}명
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-2 flex-1 rounded-full bg-[#EEF0F3]">
                            <div
                              className="h-full rounded-full bg-[#B8C0CA]"
                              style={{ width: `${course.averageProgressRate}%` }}
                            />
                          </div>
                          <span className="w-10 text-[12px] text-[#98A2B3]">
                            {course.averageProgressRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-bold ${status.valueClassName}`}>
                          {course.completionRate}%
                        </span>
                        {status.label ? (
                          <span
                            className={`ml-2 rounded-[6px] px-2 py-1 text-[11px] font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between px-5 py-4 text-[12px] text-[#98A2B3]">
          <p>
            총 {data.length}개 · {safeCurrentPage}/{totalPages} 페이지
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              aria-label="이전 페이지"
              className="text-[#667085] disabled:cursor-not-allowed disabled:text-[#CBD0D6]"
            >
              ‹
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-current={page === safeCurrentPage ? "page" : undefined}
                className={
                  page === safeCurrentPage
                    ? "h-7 w-7 rounded-[7px] bg-[#2FAE9B] font-bold text-white"
                    : "font-semibold text-[#667085]"
                }
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              aria-label="다음 페이지"
              className="text-[#667085] disabled:cursor-not-allowed disabled:text-[#CBD0D6]"
            >
              ›
            </button>
          </div>
        </footer>
      </article>
    </section>
  );
}
