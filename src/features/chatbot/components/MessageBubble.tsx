"use client";

import { memo } from "react";
import { Bot } from "lucide-react";
import type { ChatBubble } from "../hooks/useChatbot";

type MessageBubbleProps = {
  bubble: ChatBubble;
  onConfirmAnswer: (bubbleKey: string, inquiryId: number) => void;
};

// 말풍선 1개. React.memo로 감싸 위젯이 리렌더돼도(타이핑/전송상태 변경 등)
// bubble/onConfirmAnswer가 그대로면 재렌더를 건너뛴다.
function MessageBubble({ bubble, onConfirmAnswer }: MessageBubbleProps) {
  return (
    <div
      className={`flex items-start gap-3 ${
        bubble.role === "user" ? "justify-end" : ""
      }`}
    >
      {bubble.role === "assistant" && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#439A97] text-white">
          <Bot size={17} />
        </div>
      )}

      <div className="flex max-w-[230px] flex-col gap-1.5">
        <div
          className={`whitespace-pre-wrap rounded-[16px] px-4 py-3 text-sm font-medium leading-6 shadow-[0_3px_10px_rgba(15,23,42,0.12)] ${
            bubble.role === "assistant"
              ? "rounded-tl-md border border-[#E1E8EF] bg-white text-[#0F172A]"
              : "rounded-tr-md bg-[#439A97] text-white"
          }`}
        >
          {bubble.content}
        </div>

        {bubble.isAnswerUnread && bubble.inquiryId && (
          <button
            type="button"
            onClick={() =>
              onConfirmAnswer(bubble.key, bubble.inquiryId as number)
            }
            className="self-start rounded-full bg-[#E8F5F4] px-3 py-1 text-xs font-bold text-[#2F8F8C] transition hover:bg-[#D6ECEB]"
          >
            답변 완료 · 확인하기
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
