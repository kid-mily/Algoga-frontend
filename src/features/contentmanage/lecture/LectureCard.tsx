interface LectureCardProps {
  thumbnail?: string | null;
  country?: string | null;
  title?: string | null;
  description?: string | null;
  price?: string | number | null;
  isPublic?: boolean;

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
  isPublic = false,

  onChapterManage,
  onUsersClick,
  onEditClick,
  onDeleteClick,
}: LectureCardProps) {
  const displayTitle = title || "제목 없음";
  const displayCountry = country || "-";
  const displayDescription = description || "-";

  const displayPrice =
    typeof price === "number" ? `${price.toLocaleString()}원` : price || "-";

  return (
    // 🌟 수강생, 등록일 제거 및 남은 공간 비율 조정
    <div className="grid grid-cols-[0.9fr_1.2fr_2.5fr_1.2fr_1.2fr_1fr_1fr] items-center border-b border-[#E4E7EC] bg-white px-5 py-5">
      {/* 썸네일 */}
      <div className="pr-6">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={displayTitle}
            className="h-[60px] w-[96px] rounded-[14px] object-cover"
          />
        ) : (
          <div className="flex h-[60px] w-[96px] items-center justify-center rounded-[14px] bg-[#F2F4F7] text-[12px] text-[#98A2B3]">
            이미지 없음
          </div>
        )}
      </div>

      {/* 국가 */}
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-semibold text-[#111827]">
          {displayCountry}
        </span>
      </div>

      {/* 제목 */}
      <div className="min-w-0 pl-8">
        <h3 className="truncate text-[16px] font-semibold text-[#111827]">
          {displayTitle}
        </h3>

        <p className="mt-1 line-clamp-2 text-[14px] text-[#98A2B3]">
          {displayDescription}
        </p>
      </div>

      {/* 가격 */}
      <div className="text-[16px] font-semibold text-[#111827]">
        {displayPrice}
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