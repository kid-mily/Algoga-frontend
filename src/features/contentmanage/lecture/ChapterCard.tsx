"use client";

interface ChapterCardProps {
  id: number;

  duration: string;

  title: string;

  description: string;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function ChapterCard({
  id,
  duration,
  title,
  description,

  onEdit,
  onDelete,
}: ChapterCardProps) {

  return (
    <div className="rounded-[18px] border border-[#E4E7EC] bg-white p-5">

      {/* 상단 */}
      <div className="flex items-start justify-between">

        {/* 왼쪽 */}
        <div className="flex gap-3">

          {/* 메뉴 */}
          <button type="button">
            <img
              src="/images/menu.svg"
              alt="메뉴"
              className="mt-1 h-[14px] w-[14px]"
            />
          </button>

          {/* 내용 */}
          <div>

            {/* chapter info */}
            <div className="flex items-center gap-2">

              <p className="text-[14px] font-semibold text-[#667085]">
                Chapter {id}
              </p>

              <div className="h-[4px] w-[4px] rounded-full bg-[#D0D5DD]" />

              <p className="text-[13px] text-[#98A2B3]">
                {duration}
              </p>
            </div>

            {/* 제목 */}
            <h2 className="mt-2 text-[20px] font-bold text-[#111827]">
              {title}
            </h2>

            {/* 설명 */}
            <p className="mt-1 text-[14px] text-[#98A2B3]">
              {description}
            </p>
          </div>
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-4">

          {/* 수정 */}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="transition hover:opacity-60"
            >
              <img
                src="/images/edit.svg"
                alt="수정"
                className="h-[20px] w-[20px]"
              />
            </button>
          )}

          {/* 삭제 */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="transition hover:opacity-60"
            >
              <img
                src="/images/delete.svg"
                alt="삭제"
                className="h-[20px] w-[20px]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}