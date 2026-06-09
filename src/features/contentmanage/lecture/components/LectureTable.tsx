import LectureCard from "./LectureCard";
import { LectureTableProps } from "../types";
import {
  formatPrice,
  getIsPublic,
  getLectureId,
} from "../utils/lectureFormatters";

export default function LectureTable({
  lectures,
  totalCount,
  onChapterManage,
  onUsersClick,
  onEditClick,
  onDeleteClick,
  children,
}: LectureTableProps) {
  return (
    <div className="mt-5 w-full max-w-full overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          국가, 가격, 챕터 관리, 상태, 관리 버튼이 포함된 강의 목록입니다.
        </caption>
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[12%]" />
          <col className="w-[31%]" />
          <col className="w-[12%]" />
          <col className="w-[11%]" />
          <col className="w-[8%]" />
          <col className="w-[16%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#FCFCFD] text-[13px] font-semibold text-[#667085]">
            <th scope="col" className="px-3 py-4 text-left">썸네일</th>
            <th scope="col" className="px-3 py-4 text-left">국가</th>
            <th scope="col" className="px-3 py-4 text-left">강의 제목</th>
            <th scope="col" className="px-3 py-4 text-left">가격</th>
            <th scope="col" className="px-3 py-4 text-left">챕터</th>
            <th scope="col" className="px-3 py-4 text-center">상태</th>
            <th scope="col" className="px-3 py-4 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {lectures.length === 0 ? (
            <tr>
              <td colSpan={7} className="h-[200px] px-3 py-5 text-center text-[14px] text-[#98A2B3]">
                등록된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            lectures.map((lecture) => {
              const courseId = getLectureId(lecture);

              return (
                <LectureCard
                  key={courseId}
                  thumbnail={lecture.thumbnailUrl || lecture.thumbnail_url || ""}
                  country={lecture.countryName || lecture.country_name || "-"}
                  title={lecture.title || "-"}
                  description={lecture.description || "-"}
                  price={formatPrice(lecture.price)}
                  isPublic={getIsPublic(lecture)}
                  onChapterManage={() => onChapterManage(courseId)}
                  onUsersClick={() =>
                    onUsersClick({ id: courseId, title: lecture.title || "" })
                  }
                  onEditClick={() => onEditClick(courseId)}
                  onDeleteClick={() => onDeleteClick(courseId)}
                />
              );
            })
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-3 border-t border-[#E4E7EC] px-4 py-4">
        <p className="shrink-0 text-[13px] font-medium text-[#667085]">
          총 {totalCount}개 강의
        </p>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
