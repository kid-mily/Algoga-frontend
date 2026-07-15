import { Download, Search } from "lucide-react";
import { downloadInterestLecturesCsv } from "@/features/services/adminInterestStatistics.service";
import type { PopularCountryCourseRankingTableProps } from "../types";
import { getCompletionStatusStyle } from "../utils";



export default function PopularCountryCourseRankingTable({
  data,
}: PopularCountryCourseRankingTableProps) {
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
                placeholder="강의명 나라 검색..."
                className="ml-2 w-full bg-transparent text-[12px] outline-none placeholder:text-[#98A2B3]"
              />
            </label>

            <button
              type="button"
              onClick={() => void downloadInterestLecturesCsv()}
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
              {data.map((course) => {
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
          <p>총 20개 · 1/2 페이지</p>
          <div className="flex items-center gap-3">
            <button type="button" className="text-[#CBD0D6]">
              ‹
            </button>
            <button
              type="button"
              className="h-7 w-7 rounded-[7px] bg-[#2FAE9B] font-bold text-white"
            >
              1
            </button>
            <button type="button" className="font-semibold text-[#667085]">
              2
            </button>
            <button type="button" className="text-[#667085]">
              ›
            </button>
          </div>
        </footer>
      </article>
    </section>
  );
}
