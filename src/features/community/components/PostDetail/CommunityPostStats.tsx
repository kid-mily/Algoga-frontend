import { Eye, Heart, MessageCircle, ThumbsDown } from "lucide-react";
import type { CommunityPostStatsProps } from "@/features/community/types";

export default function CommunityPostStats({
  post,
  reaction,
  isReacting,
  onReaction,
}: CommunityPostStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[#CFE0DE] px-7 py-4 text-sm font-semibold text-[#7A6F66]">
      <button
        type="button"
        onClick={() => onReaction(true)}
        disabled={isReacting}
        className={`flex cursor-pointer items-center gap-2 transition disabled:opacity-60 ${
          reaction === true ? "text-[#E05252]" : "hover:text-[#E05252]"
        }`}
      >
        <Heart size={20} />
        {post.likeCount.toLocaleString()}
      </button>

      <button
        type="button"
        onClick={() => onReaction(false)}
        disabled={isReacting}
        className={`flex cursor-pointer items-center gap-2 transition disabled:opacity-60 ${
          reaction === false ? "text-[#5F928E]" : "hover:text-[#5F928E]"
        }`}
      >
        <ThumbsDown size={20} />
        {post.dislikeCount.toLocaleString()}
      </button>

      <div className="flex items-center gap-2">
        <MessageCircle size={20} />
        {post.commentCount.toLocaleString()}
      </div>

      <div className="flex items-center gap-2">
        <Eye size={20} />
        {post.viewCount.toLocaleString()}
      </div>
    </div>
  );
}
