"use client";

import { useState } from "react";

type ChatInputProps = {
  disabled?: boolean;
  onSend: (content: string) => boolean | void;
};

export default function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextMessage = message.trim();
    if (!nextMessage) return;

    const sent = onSend(nextMessage);
    if (sent === false) return;

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#EEF2F6] bg-white p-3">
      <label htmlFor="chat-message" className="sr-only">
        메시지 입력
      </label>
      <input
        id="chat-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
        placeholder="메시지를 입력하세요"
        className="h-11 min-w-0 flex-1 rounded-[14px] border border-[#D0D5DD] bg-[#F9FAFB] px-4 text-[14px] text-[#111827] outline-none focus-visible:border-[#439A97] focus-visible:ring-2 focus-visible:ring-[#C7E6E4] disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="h-11 w-16 rounded-[14px] bg-[#439A97] text-[14px] font-semibold text-white transition hover:bg-[#367c79] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
      >
        전송
      </button>
    </form>
  );
}
