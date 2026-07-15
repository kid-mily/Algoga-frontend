import type { CommunityWriteButtonProps } from "../../types";

export default function CommunityWriteButton({
  onClick,
}: CommunityWriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[42px] cursor-pointer items-center gap-2 rounded-[8px] bg-[#6BA19D] px-6 text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(107,161,157,0.18)] transition hover:bg-[#5C928E]"
    >
      <span className="text-[20px] font-light leading-none">+</span>
      <span>글쓰기</span>
    </button>
  );
}
