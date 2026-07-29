"use client";

import { useState } from "react";
import { Flag, Pencil, Trash2, MoreVertical } from "lucide-react";
import {  CommentDropdownProps } from '../../types'


export default function CommentDropdown({
  isMine,
  onEdit,
  onDelete,
  onReport,
}: CommentDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* 메뉴 열기 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#6BA19D] hover:bg-[#EEF4F4]"
        aria-label="댓글 메뉴"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-[12px] border border-[#CFE0DE] bg-white shadow-[0_10px_24px_rgba(47,42,38,0.12)]">
          {isMine ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEdit?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#2F2A26] hover:bg-[#EEF4F4]"
              >
                <Pencil size={16} />
                댓글 수정
              </button>

              <div className="mx-3 h-px bg-[#E5ECEB]" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onDelete?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#2F2A26] hover:bg-[#EEF4F4]"
              >
                <Trash2 size={16} />
                댓글 삭제
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onReport?.();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[#2F2A26] hover:bg-[#EEF4F4]"
            >
              <Flag size={16} />
              댓글 신고
            </button>
          )}
        </div>
      )}
    </div>
  );
}
