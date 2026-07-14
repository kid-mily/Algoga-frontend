import { Download, Search } from "lucide-react";
import { downloadCourseEnrollmentCsv } from "@/features/services/adminInterestStatistics.service";
import type { CourseCompletionStat } from "../types";
import { getCompletionStatusStyle } from "../utils";

type CourseCompletionAnalysisTableProps = {
  data: CourseCompletionStat[];
  keyword: string;
  isLoading?: boolean;
  onKeywordChange: (keyword: string) => void;
};

export default function CourseCompletionAnalysisTable({
  data,
  keyword,
  isLoading = false,
  onKeywordChange,
}: CourseCompletionAnalysisTableProps) {
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
              onClick={() => void downloadCourseEnrollmentCsv(keyword)}
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
                <th className="w-[25%] px-5 py-3">강의명</th>
                <th className="w-[15%] px-5 py-3">나라</th>
                <th className="w-[16%] px-5 py-3">수강생 수</th>
                <th className="w-[26%] px-5 py-3">평균 진도율</th>
                <th className="w-[18%] px-5 py-3">수료율</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[13px] text-[#98A2B3]"
                  >
                    강의별 수강 현황을 불러오는 중입니다...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[13px] text-[#98A2B3]"
                  >
                    조회된 강의별 수강 현황이 없습니다.
                  </td>
                </tr>
              ) : (
                data.map((course) => {
                  const status = getCompletionStatusStyle(course.completionStatus);

                  return (
                    <tr
                      key={course.courseId}
                      className="border-b border-[#EEF0F3] text-[13px] text-[#111827]"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {course.courseTitle}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#F2F4F7] px-3 py-1 text-[12px] font-semibold text-[#667085]">
                          {course.countryName}
                        </span>
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
