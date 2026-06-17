"use client";

import { useEffect } from "react";
import { AdminUserPost } from "@/features/csadmin/user/types";

type UserPostDetailModalProps = {
  post: AdminUserPost | null;
  onClose: () => void;
};

export default function UserPostDetailModal({
  post,
  onClose,
}: UserPostDetailModalProps) {
  useEffect(() => {
    if (!post) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <section
        className="w-full max-w-[620px] overflow-hidden rounded-[16px] bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-post-detail-title"
      >
        <header className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-5">
          <h2 id="user-post-detail-title" className="text-[20px] font-bold text-[#111827]">
            게시글 상세
          </h2>
          <button type="button" onClick={onClose} className="text-[24px] text-[#98A2B3]" aria-label="게시글 상세 닫기">
            ×
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <InfoBlock label="게시글 ID" value={post.displayId} />
          <InfoBlock label="제목" value={post.title} strong />
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#667085]">내용</p>
            <div className="max-h-[260px] overflow-y-auto rounded-[10px] bg-[#F9FAFB] px-4 py-4 text-[14px] leading-[1.7] text-[#344054]">
              {post.content || "내용이 없습니다."}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <InfoBlock label="작성일" value={post.createdAt} />
            <InfoBlock label="조회수" value={post.viewCount.toLocaleString()} />
            <InfoBlock label="댓글 수" value={post.commentCount.toLocaleString()} />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-[#667085]">{label}</p>
      <p className={`text-[14px] ${strong ? "font-bold text-[#111827]" : "font-semibold text-[#111827]"}`}>
        {value}
      </p>
    </div>
  );
}
