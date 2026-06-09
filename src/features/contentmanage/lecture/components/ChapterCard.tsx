"use client";

import { ChapterCardProps } from "../types";

export default function ChapterCard({
  id,
  duration,
  title,
  description,
  onEdit,
  onDelete,
}: ChapterCardProps) {
  const headingId = `chapter-${id}-title`;

  return (
    <article
      className="rounded-[18px] border border-[#E4E7EC] bg-white p-5"
    >
      <header className="flex items-start justify-between">
        <div className="flex gap-3">
          <button type="button" aria-label={`${id}번 챕터 이동`}>
            <img
              src="/images/menu.svg"
              alt="메뉴"
              aria-hidden="true"
              className="mt-1 h-[14px] w-[14px]"
            />
          </button>

          <div>
            <p className="flex items-center gap-2 text-[14px] font-semibold text-[#667085]">
              <span>챕터 {id}</span>
              <span className="h-[4px] w-[4px] rounded-full bg-[#D0D5DD]" aria-hidden="true" />
              <time className="text-[13px] font-normal text-[#98A2B3]">
                {duration}
              </time>
            </p>

            <h3 id={headingId} className="mt-2 text-[20px] font-bold text-[#111827]">
              {title}
            </h3>

            <p className="mt-1 text-[14px] text-[#98A2B3]">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4" aria-label={`${title} 관리 버튼`}>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`${title} 수정`}
              className="transition hover:opacity-60"
            >
              <img src="/images/edit.svg" alt="" aria-hidden="true" className="h-[20px] w-[20px]" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`${title} 삭제`}
              className="transition hover:opacity-60"
            >
              <img src="/images/delete.svg" alt="" aria-hidden="true" className="h-[20px] w-[20px]" />
            </button>
          )}
        </div>
      </header>
    </article>
  );
}
