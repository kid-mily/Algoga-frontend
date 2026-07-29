import { PencilLine } from "lucide-react";

import type { CommunityWriteButtonProps } from "../../types";

export default function CommunityWriteButton({
  onClick,
}: CommunityWriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[42px] w-[112px] cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#6BA19D] text-[14px] font-semibold text-white transition hover:bg-[#5C928E]"
    >
      <PencilLine size={17} aria-hidden="true" />
      <span>글쓰기</span>
    </button>
  );
}
