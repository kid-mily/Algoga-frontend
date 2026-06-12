import Image from "next/image";
import { LectureCardProps } from "../types";

export default function LectureCard({
  thumbnail,
  country,
  title,
  description,
  price,
  isPublic = false,
  onChapterManage,
  onQuizManage,
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
    <tr className="border-b border-[#E4E7EC] bg-white text-[14px] text-[#111827]">
      <td className="px-3 py-4 text-center align-middle">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${displayTitle} 강의 썸네일`}
            width={80}
            height={52}
            className="mx-auto rounded-[12px] object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${displayTitle} 강의 썸네일 없음`}
            className="mx-auto flex h-[52px] w-[80px] items-center justify-center rounded-[12px] bg-[#F2F4F7] text-[11px] text-[#98A2B3]"
          >
            이미지 없음
          </div>
        )}
      </td>

      <td className="px-3 py-4 align-middle">
        <span className="block truncate text-[15px] font-semibold text-[#111827]">
          {displayCountry}
        </span>
      </td>

      <td className="min-w-0 px-3 py-4 align-middle">
        <h3 className="truncate text-[15px] font-semibold text-[#111827]">
          {displayTitle}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-[#98A2B3]">
          {displayDescription}
        </p>
      </td>

      <td className="px-3 py-4 align-middle">
        <span className="block truncate text-[15px] font-semibold text-[#111827]">
          {displayPrice}
        </span>
      </td>

      <td className="px-3 py-4 text-center align-middle">
        <div className="flex min-w-0 items-center justify-center gap-2">
          <button
            type="button"
            onClick={onChapterManage}
            aria-label={`${displayTitle} 챕터 관리`}
            className="whitespace-nowrap rounded-full border border-[#B7E4C7] bg-[#EAF7EE] px-2.5 py-1.5 text-[12px] font-semibold text-[#43A047]"
          >
            챕터관리
          </button>
          <button
            type="button"
            onClick={onQuizManage}
            aria-label={`${displayTitle} 퀴즈 관리`}
            className="whitespace-nowrap rounded-full border border-[#B7D7E8] bg-[#ECF7FC] px-2.5 py-1.5 text-[12px] font-semibold text-[#1570EF]"
          >
            퀴즈관리
          </button>
        </div>
      </td>

      <td className="px-3 py-4 text-center align-middle">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold ${
            isPublic
              ? "border border-[#B7E4C7] bg-[#EAF7EE] text-[#43A047]"
              : "border border-[#E4E7EC] bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {isPublic ? "공개" : "비공개"}
        </span>
      </td>

      <td className="px-3 py-4 align-middle">
        <div className="flex min-w-0 items-center justify-center gap-2">
          <button
            type="button"
            onClick={onUsersClick}
            aria-label={`${displayTitle} 수강생 보기`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
          >
            <img src="/images/users.svg" alt="사람" aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={onEditClick}
            aria-label={`${displayTitle} 강의 수정`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
          >
            <img src="/images/edit.svg" alt="연필" aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={onDeleteClick}
            aria-label={`${displayTitle} 강의 삭제`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
          >
            <img src="/images/delete.svg" alt="쓰레기통" aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
