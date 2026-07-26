"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getMe } from "@/features/services/user.service";
import {
  askChatbot,
  askSuggestedQuestion,
  ChatbotApiError,
  getChatbotHistory,
  getSuggestedQuestions,
} from "@/features/services/chatbot.service";
import {
  createInquiry,
  getInquiryCategories,
  markInquiryAnswerRead,
} from "@/features/services/inquiry.service";
import type {
  InquiryCategory,
  InquiryCategoryOption,
  SuggestedQuestion,
  UnifiedChatHistoryItem,
} from "../types";

export type ChatBubble = {
  key: string;
  role: "assistant" | "user";
  content: string;
  inquiryId?: number; // 답변 미확인 문의일 때만
  isAnswerUnread?: boolean; // "답변 완료" 뱃지 표시 여부
};

export type ChatbotAuthStatus = "unknown" | "authed" | "guest";
export type ChatbotView = "chat" | "inquiry";

const GREETING: ChatBubble = {
  key: "greeting",
  role: "assistant",
  content:
    "안녕하세요! 알고가 AI 여행 도우미입니다. 여행 계획, 강좌 추천, 예약 도움이 필요하시면 말씀해 주세요.",
};

// Retry-After 헤더를 못 읽었을 때(교차 출처 등) 사용할 기본 잠금(초)
const DEFAULT_RATE_LIMIT_LOCK = 2;

const extractInquiryId = (historyId: string) =>
  Number(historyId.replace("INQ_", ""));

// 통합 히스토리(최신순)를 대화 버블(오래된→최신)로 변환
const historyToBubbles = (items: UnifiedChatHistoryItem[]): ChatBubble[] => {
  const ordered = [...items].reverse();
  const bubbles: ChatBubble[] = [];

  ordered.forEach((item) => {
    bubbles.push({
      key: `${item.id}-q`,
      role: "user",
      content: item.question,
    });

    if (item.answer) {
      const isInquiry = item.type === "INQUIRY";
      bubbles.push({
        key: `${item.id}-a`,
        role: "assistant",
        content: item.answer,
        inquiryId:
          isInquiry && item.isAnswerUnread
            ? extractInquiryId(item.id)
            : undefined,
        isAnswerUnread: isInquiry ? item.isAnswerUnread : false,
      });
    } else if (item.type === "INQUIRY" && item.status === "PENDING") {
      bubbles.push({
        key: `${item.id}-a`,
        role: "assistant",
        content: "문의가 접수되었습니다. 답변이 등록되면 알려드릴게요.",
      });
    }
  });

  return bubbles;
};

export const useChatbot = (isOpen: boolean) => {
  const [authStatus, setAuthStatus] = useState<ChatbotAuthStatus>("unknown");
  const [bubbles, setBubbles] = useState<ChatBubble[]>([GREETING]);
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [view, setView] = useState<ChatbotView>("chat");

  // 1:1 문의 폼
  const [categories, setCategories] = useState<InquiryCategoryOption[]>([]);
  const [inquiryCategory, setInquiryCategory] = useState<InquiryCategory | "">(
    ""
  );
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [handoffSummary, setHandoffSummary] = useState<string | null>(null);

  const dataLoadedRef = useRef(false);
  const keyRef = useRef(0);
  // 진행 중인 전송(직접 질문/예상질문)을 취소하기 위한 컨트롤러.
  // 위젯이 닫히거나 언마운트되면 abort해 stale 응답이 append되는 것을 막는다.
  const sendAbortRef = useRef<AbortController | null>(null);
  const nextKey = () => `live-${(keyRef.current += 1)}`;

  // 인증 확인: 챗봇을 열 때마다, 그리고 로그인/로그아웃 이벤트 시 다시 확인한다.
  // (위젯은 레이아웃에 상주해 로그인 후에도 언마운트되지 않으므로 재확인이 필요)
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const checkAuth = async () => {
      const me = await getMe(controller.signal).catch(() => null);
      if (controller.signal.aborted) return;
      setAuthStatus(me ? "authed" : "guest");
    };

    void checkAuth();

    const handleAuthChange = () => {
      dataLoadedRef.current = false; // 로그인/로그아웃 시 히스토리 재적재 허용
      void checkAuth();
    };
    window.addEventListener("auth-state-changed", handleAuthChange);

    return () => {
      controller.abort();
      window.removeEventListener("auth-state-changed", handleAuthChange);
    };
  }, [isOpen]);

  // 히스토리/예상질문 로드: 로그인 확인 후 1회
  useEffect(() => {
    if (!isOpen || authStatus !== "authed" || dataLoadedRef.current) return;

    const controller = new AbortController();

    const load = async () => {
      const [history, suggested] = await Promise.all([
        getChatbotHistory(0, 20, controller.signal).catch((error) => {
          console.error("[chatbot] 대화 히스토리 조회 실패:", error);
          return null;
        }),
        getSuggestedQuestions(controller.signal).catch((error) => {
          console.error("[chatbot] 예상질문(선택지) 조회 실패:", error);
          return [];
        }),
      ]);
      if (controller.signal.aborted) return;

      // 실제로 응답을 받은 뒤에만 재적재를 막는다(중도 취소 시 다시 시도 가능)
      dataLoadedRef.current = true;
      setSuggestions(suggested ?? []);
      if (history) {
        setBubbles([GREETING, ...historyToBubbles(history.content)]);
      }
    };

    void load();

    return () => controller.abort();
  }, [isOpen, authStatus]);

  // 위젯이 닫히거나 언마운트되면 진행 중인 전송을 취소해 stale 응답을 막는다.
  useEffect(() => {
    if (isOpen) return;
    sendAbortRef.current?.abort();
  }, [isOpen]);

  useEffect(() => () => sendAbortRef.current?.abort(), []);

  // 레이트리밋 카운트다운
  useEffect(() => {
    if (lockSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setLockSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [lockSeconds]);

  const ensureCategoriesLoaded = useCallback(async () => {
    if (categories.length > 0) return;
    const list = await getInquiryCategories().catch(() => []);
    setCategories(list);
  }, [categories.length]);

  const appendAssistant = useCallback((content: string) => {
    setBubbles((prev) => [
      ...prev,
      { key: nextKey(), role: "assistant", content },
    ]);
  }, []);

  // 2-4. 직접 질문. 입력값은 입력 폼(ChatInputForm)에서 인자로 받는다
  // (input을 클로저로 잡지 않아 타이핑마다 send가 재생성되지 않음).
  const send = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (
        !question ||
        isSending ||
        lockSeconds > 0 ||
        authStatus !== "authed"
      ) {
        return;
      }

      sendAbortRef.current?.abort();
      const controller = new AbortController();
      sendAbortRef.current = controller;

      setBubbles((prev) => [
        ...prev,
        { key: nextKey(), role: "user", content: question },
      ]);
      setIsSending(true);

      try {
        const result = await askChatbot(question, controller.signal);
        if (controller.signal.aborted) return;

        appendAssistant(result.answer);

        if (result.mode === "RATE_LIMITED") {
          setLockSeconds(
            result.retryAfterSeconds && result.retryAfterSeconds > 0
              ? result.retryAfterSeconds
              : DEFAULT_RATE_LIMIT_LOCK
          );
        } else if (result.mode === "AGENT_HANDOFF") {
          setHandoffSummary(result.handoffSummary);
          setInquiryContent(result.handoffInquiry ?? question);
          await ensureCategoriesLoaded();
          setView("inquiry");
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          error instanceof ChatbotApiError || error instanceof Error
            ? error.message
            : "챗봇 답변에 실패했습니다.";
        appendAssistant(message);
      } finally {
        // 더 새로운 전송이 시작됐다면 그쪽이 상태를 소유하므로 건드리지 않는다.
        if (sendAbortRef.current === controller) {
          sendAbortRef.current = null;
          setIsSending(false);
        }
      }
    },
    [isSending, lockSeconds, authStatus, appendAssistant, ensureCategoriesLoaded]
  );

  // 2-3. 예상 질문 클릭
  const askSuggested = useCallback(
    async (question: SuggestedQuestion) => {
      if (isSending || lockSeconds > 0 || authStatus !== "authed") return;

      sendAbortRef.current?.abort();
      const controller = new AbortController();
      sendAbortRef.current = controller;

      setBubbles((prev) => [
        ...prev,
        { key: nextKey(), role: "user", content: question.question },
      ]);
      setIsSending(true);

      try {
        const result = await askSuggestedQuestion(
          question.suggestedQuestionId,
          controller.signal
        );
        if (controller.signal.aborted) return;

        appendAssistant(result.answer);
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          error instanceof Error
            ? error.message
            : "답변을 불러오지 못했습니다.";
        appendAssistant(message);
      } finally {
        if (sendAbortRef.current === controller) {
          sendAbortRef.current = null;
          setIsSending(false);
        }
      }
    },
    [isSending, lockSeconds, authStatus, appendAssistant]
  );

  const openInquiry = useCallback(async () => {
    await ensureCategoriesLoaded();
    setView("inquiry");
  }, [ensureCategoriesLoaded]);

  const backToChat = useCallback(() => {
    setView("chat");
    setFormError("");
  }, []);

  // 3-2. 문의 등록 (제목 2자·내용 5자 선검증)
  const submitInquiry = useCallback(async () => {
    if (isSubmitting) return;
    setFormError("");

    if (!inquiryCategory) {
      setFormError("문의 유형을 선택해 주세요.");
      return;
    }
    const title = inquiryTitle.trim();
    const content = inquiryContent.trim();
    if (title.length < 2) {
      setFormError("제목을 2자 이상 입력해 주세요.");
      return;
    }
    if (content.length < 5) {
      setFormError("내용을 5자 이상 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createInquiry({ category: inquiryCategory, title, content });

      appendAssistant(
        "문의가 접수되었습니다. 답변이 등록되면 알려드릴게요."
      );
      setView("chat");
      setInquiryTitle("");
      setInquiryContent("");
      setInquiryCategory("");
      setHandoffSummary(null);
    } catch (error) {
      const message =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : "문의 등록에 실패했습니다.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    inquiryCategory,
    inquiryTitle,
    inquiryContent,
    appendAssistant,
  ]);

  // 4-2. 문의 답변 확인 → "답변 완료" 뱃지 해제
  const confirmInquiryAnswer = useCallback(
    async (bubbleKey: string, inquiryId: number) => {
      setBubbles((prev) =>
        prev.map((bubble) =>
          bubble.key === bubbleKey
            ? { ...bubble, isAnswerUnread: false, inquiryId: undefined }
            : bubble
        )
      );

      // 실패해도 UI는 유지 (다음 히스토리 조회 때 재동기화)
      await markInquiryAnswerRead(inquiryId).catch(() => undefined);
    },
    []
  );

  return {
    authStatus,
    view,
    bubbles,
    suggestions,
    isSending,
    lockSeconds,
    send,
    askSuggested,
    // inquiry
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
  };
};
