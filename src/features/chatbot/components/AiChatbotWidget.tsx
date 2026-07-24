"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronLeft, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  INQUIRY_CATEGORY_LABEL,
  InquiryCategory,
  type InquiryCategoryOption,
} from "../types";
import { useChatbot } from "../hooks/useChatbot";
import ChatInputForm from "./ChatInputForm";
import MessageBubble from "./MessageBubble";

// 서버 카테고리 조회 전/실패 시 쓰는 정적 fallback (렌더마다 재생성하지 않도록 모듈 상수로).
const FALLBACK_INQUIRY_CATEGORIES: InquiryCategoryOption[] = (
  Object.keys(INQUIRY_CATEGORY_LABEL) as InquiryCategory[]
).map((code) => ({ code, description: INQUIRY_CATEGORY_LABEL[code] }));

const hiddenPathPrefixes = [
  "/auth",
  "/oauth2",
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

export default function AiChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const chatbot = useChatbot(isOpen);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isHiddenPage = useMemo(
    () => hiddenPathPrefixes.some((prefix) => pathname.startsWith(prefix)),
    [pathname]
  );
  const openInquiryFromEvent = chatbot.openInquiry;

  useEffect(() => {
    const handleOpenInquiry = () => {
      setIsOpen(true);
      void openInquiryFromEvent();
    };

    window.addEventListener("algoga-open-inquiry", handleOpenInquiry);
    return () =>
      window.removeEventListener("algoga-open-inquiry", handleOpenInquiry);
  }, [openInquiryFromEvent]);

  // 새 메시지가 추가되면 맨 아래로 스크롤
  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [isOpen, chatbot.bubbles, chatbot.view]);

  if (isHiddenPage) return null;

  const {
    authStatus,
    view,
    bubbles,
    suggestions,
    isSending,
    lockSeconds,
    send,
    askSuggested,
    categories,
    inquiryCategory,
    setInquiryCategory,
    inquiryTitle,
    setInquiryTitle,
    inquiryContent,
    setInquiryContent,
    isSubmitting,
    formError,
    handoffSummary,
    openInquiry,
    backToChat,
    submitInquiry,
    confirmInquiryAnswer,
  } = chatbot;

  const isLocked = lockSeconds > 0;
  const isInputDisabled = isSending || isLocked;

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitInquiry();
  };

  return (
    <section aria-label="알고가 AI 챗봇">
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9800] flex h-[520px] max-h-[calc(100vh-140px)] w-[340px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[20px] border border-[#DDE9EF] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] sm:right-8">
          <div className="flex h-[72px] shrink-0 items-center justify-between bg-[#439A97] px-5 text-white">
            <div className="flex items-center gap-3">
              {view === "inquiry" && (
                <button
                  type="button"
                  aria-label="채팅으로 돌아가기"
                  onClick={backToChat}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Bot size={21} strokeWidth={2.2} />
              </div>

              <h2 className="text-lg font-extrabold tracking-[0px]">
                {view === "inquiry" ? "1:1 문의" : "알고가 AI"}
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

          <div className="flex min-h-0 flex-1 flex-col bg-[#F5FAFE]">
            {authStatus === "unknown" && (
              <div className="flex flex-1 items-center justify-center px-6 text-center text-sm font-medium text-[#64748B]">
                불러오는 중입니다...
              </div>
            )}

            {authStatus === "guest" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm font-medium leading-6 text-[#475569]">
                  알고가 AI 챗봇과 1:1 문의는
                  <br />
                  로그인 후 이용할 수 있습니다.
                </p>
                <Link
                  href="/auth/login"
                  className="rounded-full bg-[#439A97] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#357F7C]"
                >
                  로그인하러 가기
                </Link>
              </div>
            )}

            {authStatus === "authed" && view === "chat" && (
              <>
                <div
                  ref={scrollRef}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6"
                >
                  {bubbles.map((bubble) => (
                    <MessageBubble
                      key={bubble.key}
                      bubble={bubble}
                      onConfirmAnswer={confirmInquiryAnswer}
                    />
                  ))}

                  {isSending && (
                    <div className="flex items-center gap-3">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#439A97] text-white">
                        <Bot size={17} />
                      </div>
                      <div className="rounded-[16px] rounded-tl-md border border-[#E1E8EF] bg-white px-4 py-3 text-sm font-medium text-[#98A2B3] shadow-[0_3px_10px_rgba(15,23,42,0.12)]">
                        답변을 작성하고 있어요...
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-[#E6EEF3] bg-white">
                  {suggestions.length > 0 && (
                    <div className="px-4 pt-3">
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((question) => (
                          <button
                            key={question.suggestedQuestionId}
                            type="button"
                            onClick={() => void askSuggested(question)}
                            disabled={isInputDisabled}
                            className="cursor-pointer rounded-full border border-[#CDE7E5] bg-[#EEF6FD] px-3 py-1.5 text-xs font-bold text-[#439A97] transition hover:border-[#8FCBC7] hover:bg-[#D2ECEA] hover:text-[#2F7F7C] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {question.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="px-4 pb-1 pt-3">
                    <button
                      type="button"
                      onClick={() => void openInquiry()}
                      className="cursor-pointer text-xs font-bold text-[#3B6FB0] underline-offset-2 transition hover:underline"
                    >
                      답변이 부족하면 1:1 문의하기 →
                    </button>
                  </div>

                  {isLocked && (
                    <p className="px-4 pb-1 text-center text-xs font-semibold text-[#EF4444]">
                      요청이 많아요. {lockSeconds}초 후 다시 시도해 주세요.
                    </p>
                  )}

                  <ChatInputForm
                    onSend={send}
                    disabled={isInputDisabled}
                    isLocked={isLocked}
                    lockSeconds={lockSeconds}
                  />
                </div>
              </>
            )}

            {authStatus === "authed" && view === "inquiry" && (
              <form
                onSubmit={handleInquirySubmit}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
              >
                {handoffSummary && (
                  <div className="rounded-[12px] border border-[#DCEBEA] bg-[#EEF7F6] px-4 py-3 text-xs leading-5 text-[#3F6F6D]">
                    <p className="mb-1 font-bold">상담 요약</p>
                    <p className="whitespace-pre-wrap">{handoffSummary}</p>
                  </div>
                )}

                <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#334155]">
                  문의 유형
                  <select
                    value={inquiryCategory}
                    onChange={(event) =>
                      setInquiryCategory(event.target.value as InquiryCategory)
                    }
                    className="h-11 rounded-[10px] border border-[#DDE5EC] bg-white px-3 text-sm font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-[#9AD1CE]"
                  >
                    <option value="" disabled>
                      선택해 주세요
                    </option>
                    {(categories.length > 0
                      ? categories
                      : FALLBACK_INQUIRY_CATEGORIES
                    ).map((category) => (
                      <option key={category.code} value={category.code}>
                        {category.description}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#334155]">
                  제목
                  <input
                    value={inquiryTitle}
                    onChange={(event) => setInquiryTitle(event.target.value)}
                    maxLength={100}
                    placeholder="문의 제목을 입력하세요 (2자 이상)"
                    className="h-11 rounded-[10px] border border-[#DDE5EC] bg-white px-3 text-sm font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-[#9AD1CE]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1.5 text-sm font-semibold text-[#334155]">
                  내용
                  <textarea
                    value={inquiryContent}
                    onChange={(event) => setInquiryContent(event.target.value)}
                    maxLength={2000}
                    placeholder="문의 내용을 입력하세요 (5자 이상)"
                    className="min-h-[120px] flex-1 resize-none rounded-[10px] border border-[#DDE5EC] bg-white px-3 py-2.5 text-sm font-medium leading-6 text-[#0F172A] outline-none focus:ring-2 focus:ring-[#9AD1CE]"
                  />
                </label>

                {formError && (
                  <p className="text-xs font-semibold text-[#EF4444]">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 shrink-0 rounded-full bg-[#439A97] text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "등록 중..." : "문의 등록"}
                </button>
              </form>
            )}
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
