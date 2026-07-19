"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const hiddenPathPrefixes = [
  "/auth",
  "/oauth2",
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

const quickActions = ["직접 입력하기", "항공권 예약", "강좌 추천"];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "안녕하세요! 알고가 AI 여행 도우미입니다. 여행 계획, 강좌 추천, 예약 도움이 필요하시면 말씀해 주세요.",
  },
];

export default function AiChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const isHiddenPage = useMemo(
    () => hiddenPathPrefixes.some((prefix) => pathname.startsWith(prefix)),
    [pathname]
  );

  if (isHiddenPage) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        role: "user",
        content: trimmedMessage,
      },
    ]);
    setMessage("");
  };

  return (
    <section aria-label="알고가 AI 챗봇">
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9800] w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[20px] border border-[#DDE9EF] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] sm:right-8">
          <div className="flex h-[72px] items-center justify-between bg-[#439A97] px-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Bot size={21} strokeWidth={2.2} />
              </div>

              <h2 className="text-lg font-extrabold tracking-[0px]">
                알고가 AI
              </h2>
            </div>

            <button
              type="button"
              aria-label="알고가 AI 닫기"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-white/10"
            >
              <X size={21} />
            </button>
          </div>

          <div className="flex h-[405px] flex-col bg-[#F5FAFE]">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6">
              {messages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={`flex items-start gap-3 ${
                    chatMessage.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {chatMessage.role === "assistant" && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#439A97] text-white">
                      <Bot size={17} />
                    </div>
                  )}

                  <div
                    className={`max-w-[230px] rounded-[16px] px-4 py-3 text-sm font-medium leading-6 shadow-[0_3px_10px_rgba(15,23,42,0.12)] ${
                      chatMessage.role === "assistant"
                        ? "rounded-tl-md border border-[#E1E8EF] bg-white text-[#0F172A]"
                        : "rounded-tr-md bg-[#439A97] text-white"
                    }`}
                  >
                    {chatMessage.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E6EEF3] bg-white">
              <div className="flex gap-2 overflow-x-auto px-4 py-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setMessage(action)}
                    className="h-8 shrink-0 cursor-pointer rounded-full bg-[#EEF6FD] px-3 text-xs font-bold text-[#439A97] transition hover:bg-[#E1F0F0]"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3 border-t border-[#EDF2F7] px-4 py-4"
              >
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="h-12 min-w-0 flex-1 rounded-full bg-[#F2F6FA] px-4 text-sm font-medium text-[#0F172A] outline-none placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#9AD1CE]"
                />

                <button
                  type="submit"
                  aria-label="메시지 보내기"
                  className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#A7D6D3] text-white transition hover:bg-[#439A97]"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={isOpen ? "알고가 AI 닫기" : "알고가 AI 열기"}
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed bottom-8 right-6 z-[9810] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#439A97] text-white shadow-[0_14px_26px_rgba(67,154,151,0.28)] transition hover:bg-[#357F7C] sm:right-8"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={24} />}

        {!isOpen && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-[#8FE3C7]"
          />
        )}
      </button>
    </section>
  );
}
