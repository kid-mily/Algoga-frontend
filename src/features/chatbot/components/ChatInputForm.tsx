"use client";

import { FormEvent, memo, useState } from "react";
import { Send } from "lucide-react";

type ChatInputFormProps = {
  onSend: (text: string) => void;
  disabled: boolean;
  isLocked: boolean;
  lockSeconds: number;
};

// 입력 상태를 이 컴포넌트 로컬로 소유해, 타이핑 리렌더가 위젯 트리 전체로
// 전파되지 않고 이 폼 안에 갇히도록 한다.
function ChatInputForm({
  onSend,
  disabled,
  isLocked,
  lockSeconds,
}: ChatInputFormProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || disabled) return;

    onSend(text);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-[#EDF2F7] px-4 py-4"
    >
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={disabled}
        maxLength={1000}
        placeholder={
          isLocked ? `${lockSeconds}초 후 입력 가능` : "메시지를 입력하세요..."
        }
        className="h-12 min-w-0 flex-1 rounded-full bg-[#F2F6FA] px-4 text-sm font-medium text-[#0F172A] outline-none placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#9AD1CE] disabled:opacity-60"
      />

      <button
        type="submit"
        aria-label="메시지 보내기"
        disabled={disabled || !input.trim()}
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#439A97] text-white transition hover:bg-[#2F7F7C] disabled:cursor-not-allowed disabled:bg-[#A7D6D3] disabled:opacity-100"
      >
        <Send size={20} />
      </button>
    </form>
  );
}

export default memo(ChatInputForm);
