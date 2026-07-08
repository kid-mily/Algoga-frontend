import { MoreVertical } from "lucide-react";

type CommunityCommentItemProps = {
  author: string;
  createdAt: string;
  content: string;
  profileText: string;
};

export default function CommunityCommentItem({
  author,
  createdAt,
  content,
  profileText,
}: CommunityCommentItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
        {profileText}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{author}</span>
          <span className="text-xs text-slate-400">{createdAt}</span>
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-600">{content}</p>
      </div>

      <button
        type="button"
        className="mt-1 text-teal-600 hover:text-teal-700"
        aria-label="댓글 더보기"
      >
        <MoreVertical size={20} />
      </button>
    </div>
  );
}