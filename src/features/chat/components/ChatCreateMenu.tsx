import { MessageCircle, Users } from "lucide-react";

interface ChatCreateMenuProps {
  onStartOneToOneChat: () => void;
  onStartGroupChat: () => void;
}

export default function ChatCreateMenu({
  onStartOneToOneChat,
  onStartGroupChat,
}: ChatCreateMenuProps) {
  return (
    <div className="absolute right-8 top-14 z-50 w-[240px] overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        onClick={onStartOneToOneChat}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FB]">
          <MessageCircle size={22} className="text-[#5F9D9A]" />
        </div>

        <div>
          <p className="text-[18px] font-bold text-[#111827]">새 채팅</p>
          <p className="mt-0.5 text-[14px] font-semibold text-[#8C98AA]">
            1:1 대화 시작
          </p>
        </div>
      </button>

      <div className="h-px bg-gray-100" />

      <button
        type="button"
        onClick={onStartGroupChat}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FB]">
          <Users size={22} className="text-[#5F9D9A]" />
        </div>

        <div>
          <p className="text-[18px] font-bold text-[#111827]">그룹 채팅</p>
          <p className="mt-0.5 text-[14px] font-semibold text-[#8C98AA]">
            여러 명과 대화
          </p>
        </div>
      </button>
    </div>
  );
}