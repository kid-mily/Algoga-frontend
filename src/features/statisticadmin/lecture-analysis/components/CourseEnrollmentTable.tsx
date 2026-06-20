import { CourseEnrollmentStatistic } from "../types";
import { formatHours, formatNumber, formatPercent } from "../utils";

type CourseEnrollmentTableProps = {
  courses: CourseEnrollmentStatistic[];
  isLoading: boolean;
};

const COLUMN_COUNT = 5;

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td
        colSpan={COLUMN_COUNT}
        role="status"
        aria-live="polite"
        className="px-6 py-12 text-center text-[14px] text-[#667085]"
      >
        {message}
      </td>
    </tr>
  );
}

export default function CourseEnrollmentTable({
  courses,
  isLoading,
}: CourseEnrollmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] table-fixed border-collapse">
        <caption className="sr-only">강의별 수강률 분석 목록</caption>
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[14px] font-bold text-[#344054]">
            <th scope="col" className="px-6 py-4">강의명</th>
            <th scope="col" className="w-[180px] px-6 py-4">수강생 수</th>
            <th scope="col" className="w-[250px] px-6 py-4">평균 진도율</th>
            <th scope="col" className="w-[180px] px-6 py-4">수료율</th>
            <th scope="col" className="w-[180px] px-6 py-4">평균 학습 시간</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <EmptyRow message="수강률 분석 데이터를 불러오는 중입니다..." />
          ) : courses.length === 0 ? (
            <EmptyRow message="수강률 분석 데이터가 없습니다." />
          ) : (
            courses.map((course) => (
              <tr
                key={course.courseId}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="truncate px-6 py-5 font-bold text-[#111827]">
                  {course.courseTitle}
                </td>
                <td className="px-6 py-5">
                  {formatNumber(course.studentCount)}명
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-[7px] w-[100px] overflow-hidden rounded-full bg-[#E5E7EB]">
                      <div
                        className="h-full rounded-full bg-[#639E9B]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, course.averageProgressRate)
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-bold text-[#111827]">
                      {formatPercent(course.averageProgressRate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 font-semibold text-[#16A34A]">
                  {formatPercent(course.completionRate)}
                </td>
                <td className="px-6 py-5">
                  {formatHours(course.averageLearningHours)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
