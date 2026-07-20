"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { downloadInterestLecturesCsv } from "@/features/services/adminInterestStatistics.service";
import type { PopularCountryCourseRankingTableProps } from "../types";
import { getCompletionStatusStyle } from "../utils";

const PAGE_SIZE = 10;

export default function PopularCountryCourseRankingTable({
  data,
  keyword,
  onKeywordChange,
}: PopularCountryCourseRankingTableProps) {
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
        <span className="h-6 w-1 rounded-full bg-[#F59E0B]" />
        인기 국가 강의 순위
      </h2>

      <article className="mt-5 overflow-hidden rounded-[18px] bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
          <p className="text-[12px] font-medium text-[#98A2B3]">
            수강자 수 기준 정렬
          </p>

          <div className="flex items-center gap-2">
            <label className="flex h-9 w-[210px] items-center rounded-[10px] border border-[#E4E7EC] px-3">
              <Search size={14} className="text-[#98A2B3]" />
              <span className="sr-only">강의명 나라 검색</span>
              <input
                type="text"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                placeholder="강의명 나라 검색..."
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
          <table className="w-full min-w-[1000px] table-fixed border-collapse">
            <thead className="bg-[#F7F8FA]">
              <tr className="text-left text-[12px] font-semibold text-[#667085]">
                <th className="w-[7%] px-5 py-3">순위</th>
                <th className="w-[29%] px-5 py-3">강의명</th>
                <th className="w-[18%] px-5 py-3">나라</th>
                <th className="w-[14%] px-5 py-3">수강자 수</th>
                <th className="w-[16%] px-5 py-3">평균 진도율</th>
                <th className="w-[16%] px-5 py-3">수료율</th>
              </tr>
            </thead>

            <tbody>
              {pagedData.map((course) => {
                const status = getCompletionStatusStyle(course.completionStatus);

                return (
                  <tr
                    key={`${course.rank}-${course.courseTitle}`}
                    className="border-b border-[#EEF0F3] text-[13px] text-[#111827]"
                  >
                    <td className="px-5 py-4 font-bold text-[#2FAE9B]">
                      #{course.rank}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {course.courseTitle}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#E8F7F3] px-3 py-1 text-[12px] font-bold text-[#2FAE9B]">
                        {course.countryName}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {course.enrollmentCount.toLocaleString()}명
                    </td>
                    <td className="px-5 py-4 text-[#667085]">
                      {course.averageProgressRate}%
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
              })}
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
