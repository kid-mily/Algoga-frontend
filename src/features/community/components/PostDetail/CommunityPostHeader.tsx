import Image from "next/image";
import { Edit3, Flag, Trash2 } from "lucide-react";
import type { CommunityPostHeaderProps } from "@/features/community/types";

export default function CommunityPostHeader({
  post,
  authorProfileImageUrl,
  isOwnPost,
  isDeleting,
  isReporting,
  onEdit,
  onDeleteClick,
  onReport,
}: CommunityPostHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#CFE0DE] px-7 py-6">
      <div className="flex min-w-0 items-center gap-4">
        {authorProfileImageUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-[#EEF4F4]">
            <Image
              src={authorProfileImageUrl}
              alt={`${post.authorName} 프로필 이미지`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6BA19D] text-lg font-bold text-white ring-4 ring-[#EEF4F4]">
            {post.authorInitial}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold leading-5 text-[#2F2A26]">
            {post.authorName}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {post.countryId && (
              <span className="flex h-6 items-center rounded-full bg-[#EEF4F4] px-2.5 text-xs font-bold text-[#5F928E]">
                {post.country}
              </span>
            )}
            <span className="flex h-6 items-center rounded-full border border-[#6BA19D] bg-[#6BA19D] px-2.5 text-xs font-bold text-white">
              {post.category}
            </span>
            {post.customTags.map((tag) => (
              <span
                key={tag}
                className="flex h-6 items-center rounded-full border border-[#CFE0DE] bg-white px-2.5 text-xs font-bold text-[#5F928E]"
              >
                #{tag}
              </span>
            ))}
            <span className="text-xs font-semibold text-[#9A8B7D]">
              {post.createdAt}
            </span>
          </div>
        </div>
      </div>

      {isOwnPost ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CFE0DE] text-[#5F928E] transition hover:bg-[#EEF4F4]"
            aria-label="게시글 수정"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            onClick={onDeleteClick}
            disabled={isDeleting}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FECACA] text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="게시글 삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onReport}
          disabled={isReporting}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#CFE0DE] bg-white px-3 text-xs font-bold text-[#7A6F66] transition hover:border-[#6BA19D] hover:bg-[#EEF4F4] hover:text-[#5F928E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Flag size={16} />
          신고
        </button>
      )}
    </header>
  );
}
