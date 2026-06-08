import LectureCard from "./LectureCard";
import { formatPrice, getIsPublic, getLectureId } from "../utils/lectureFormatters";

type LectureTableProps = {
  lectures: any[];
  totalCount: number;
  onChapterManage: (courseId: number) => void;
  onUsersClick: (course: { id: number; title: string }) => void;
  onEditClick: (courseId: number) => void;
  onDeleteClick: (courseId: number) => void;
  children?: React.ReactNode;
};

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
    <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white">
      <div className="grid grid-cols-[0.9fr_1.2fr_2.5fr_1.2fr_1.2fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
        <div>썸네일</div>
        <div>국가</div>
        <div className="pl-8">강의 제목</div>
        <div>가격</div>
        <div>챕터관리</div>
        <div className="text-center">상태</div>
        <div className="text-center">액션</div>
      </div>

      {lectures.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-[14px] text-[#98A2B3]">
          등록된 강의가 없습니다.
        </div>
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

      <div className="flex items-center justify-between px-4 py-4">
        <p className="text-[13px] font-medium text-[#667085]">
          총 {totalCount}개의 강의
        </p>
        {children}
      </div>
    </div>
  );
}