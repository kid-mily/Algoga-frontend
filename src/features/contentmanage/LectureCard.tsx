interface LectureCardProps {
  thumbnail: string;
  country: string;
  title: string;
  description: string;
  price: string;
  students: string;
  chapters: number;
  createdAt: string;
  isPublic: boolean;

  // 버튼 이벤트
  onChapterManage?: () => void;
  onUsersClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export default function LectureCard({
  thumbnail,
  country,
  title,
  description,
  price,
  students,
  chapters,
  createdAt,
  isPublic,

  onChapterManage,
  onUsersClick,
  onEditClick,
  onDeleteClick,
}: LectureCardProps) {

  return (
    <div className="grid grid-cols-[0.9fr_0.9fr_2fr_1fr_1fr_0.8fr_1.2fr_1fr_1fr_1fr] items-center border-b border-[#E4E7EC] bg-white px-5 py-5">

      {/* 썸네일 */}
      <div className="pr-6">
        <img
          src={thumbnail}
          alt={title}
          className="h-[60px] w-[96px] rounded-[14px] object-cover"
        />
      </div>

      {/* 국가 */}
      <div className="flex items-center gap-2">

        <span className="text-[16px] font-semibold text-[#111827]">
          {country}
        </span>
      </div>

      {/* 제목 */}
      <div className="min-w-0">

        <h3 className="text-[16px] font-semibold text-[#111827]">
          {title}
        </h3>

        <p className="mt-1 text-[14px] text-[#98A2B3]">
          {description}
        </p>
      </div>

      {/* 가격 */}
      <div className="text-[16px] font-semibold text-[#111827]">
        {price}
      </div>

      {/* 수강생 */}
      <div className="text-[16px] font-semibold text-[#111827]">
        {students}명
      </div>

      {/* 챕터 */}
      <div className="text-[16px] font-semibold text-[#439A97]">
        {chapters}개
      </div>

      {/* 챕터 관리 */}
      <div>
        <button
          type="button"
          onClick={onChapterManage}
          className="rounded-full border border-[#B7E4C7] bg-[#EAF7EE] px-3 py-2 text-[13px] font-semibold text-[#43A047]"
        >
          챕터관리
        </button>
      </div>

      {/* 등록일 */}
      <div className="text-[14px] font-medium text-[#667085]">
        {createdAt}
      </div>

      {/* 상태 */}
      <div className="flex justify-center">

        <div
          className={`inline-flex rounded-full px-3 py-2 text-[13px] font-semibold ${
            isPublic
              ? "border border-[#B7E4C7] bg-[#EAF7EE] text-[#43A047]"
              : "border border-[#E4E7EC] bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {isPublic ? "공개" : "비공개"}
        </div>
      </div>

      {/* 액션 */}
      <div className="flex items-center justify-center gap-4">

        {/* 유저 */}
        <button
          type="button"
          onClick={onUsersClick}
          className="transition hover:opacity-60"
        >
          <img
            src="/images/users.svg"
            alt="유저"
            className="h-[20px] w-[20px]"
          />
        </button>

        {/* 수정 */}
        <button
          type="button"
          onClick={onEditClick}
          className="transition hover:opacity-60"
        >
          <img
            src="/images/edit.svg"
            alt="수정"
            className="h-[20px] w-[20px]"
          />
        </button>

        {/* 삭제 */}
        <button
          type="button"
          onClick={onDeleteClick}
          className="transition hover:opacity-60"
        >
          <img
            src="/images/delete.svg"
            alt="삭제"
            className="h-[20px] w-[20px]"
          />
        </button>
      </div>
    </div>
  );
}