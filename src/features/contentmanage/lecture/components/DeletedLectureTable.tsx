import Image from "next/image";
import type { AdminDeletedCourse } from "../types";
import { formatPrice } from "../utils/lectureFormatters";

type DeletedLectureTableProps = {
  courses: AdminDeletedCourse[];
  totalCount: number;
  children?: React.ReactNode;
};

export default function DeletedLectureTable({
  courses,
  totalCount,
  children,
}: DeletedLectureTableProps) {
  return (
    <div className="mt-5 w-full max-w-full overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          국가, 강의 제목, 난이도, 가격이 포함된 삭제 강의 목록입니다.
        </caption>
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[18%]" />
          <col className="w-[40%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#FCFCFD] text-[13px] font-semibold text-[#667085]">
            <th scope="col" className="px-3 py-4 text-center">썸네일</th>
            <th scope="col" className="px-3 py-4 text-left">국가</th>
            <th scope="col" className="px-3 py-4 text-left">강의 제목</th>
            <th scope="col" className="px-3 py-4 text-left">난이도</th>
            <th scope="col" className="px-3 py-4 text-left">가격</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={5} className="h-[200px] px-3 py-5 text-center text-[14px] text-[#98A2B3]">
                삭제된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.courseId} className="border-b border-[#F2F4F7] text-[14px] text-[#344054] last:border-b-0">
                <td className="px-3 py-4">
                  <div className="mx-auto h-[54px] w-[86px] overflow-hidden rounded-[10px] bg-[#F2F4F7]">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt=""
                        width={86}
                        height={54}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-4 font-medium">{course.countryName || "-"}</td>
                <td className="px-3 py-4">
                  <p className="truncate font-semibold text-[#111827]">{course.title}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-[#98A2B3]">
                    {course.description}
                  </p>
                </td>
                <td className="px-3 py-4">{course.levelName || course.level}</td>
                <td className="px-3 py-4">{formatPrice(course.price)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-3 border-t border-[#E4E7EC] px-4 py-4">
        <p className="shrink-0 text-[13px] font-medium text-[#667085]">
          총 {totalCount}개 삭제 강의
        </p>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
