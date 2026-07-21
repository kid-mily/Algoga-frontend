import { act, renderHook, waitFor } from "@testing-library/react";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";
import { getMe } from "@/features/services/user.service";
import {
  askChatbot,
  askSuggestedQuestion,
  getChatbotHistory,
  getSuggestedQuestions,
} from "@/features/services/chatbot.service";
import {
  createInquiry,
  getInquiryCategories,
  markInquiryAnswerRead,
} from "@/features/services/inquiry.service";

jest.mock("@/features/services/user.service", () => ({ getMe: jest.fn() }));
jest.mock("@/features/services/chatbot.service", () => ({
  ChatbotApiError: class ChatbotApiError extends Error {},
  askChatbot: jest.fn(),
  askSuggestedQuestion: jest.fn(),
  getChatbotHistory: jest.fn(),
  getSuggestedQuestions: jest.fn(),
}));
jest.mock("@/features/services/inquiry.service", () => ({
  createInquiry: jest.fn(),
  getInquiryCategories: jest.fn(),
  markInquiryAnswerRead: jest.fn(),
}));

const emptyHistory = {
  content: [], page: 0, size: 20, totalElements: 0,
  totalPages: 0, first: true, last: true,
};

const normalAnswer = {
  answer: "예약 내역에서 취소할 수 있습니다.",
  isSuccess: true,
  mode: "NORMAL" as const,
  handoffSummary: null,
  handoffInquiry: null,
};

const prepareAuthed = () => {
  (getMe as jest.Mock).mockResolvedValue({ userId: 1, nickname: "테스터" });
  (getChatbotHistory as jest.Mock).mockResolvedValue(emptyHistory);
  (getSuggestedQuestions as jest.Mock).mockResolvedValue([]);
};

describe("useChatbot 훅 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prepareAuthed();
  });

  afterEach(() => jest.useRealTimers());

  test("챗봇이 닫혀 있으면 인증과 데이터를 조회하지 않는다", () => {
    const { result } = renderHook(() => useChatbot(false));

    expect(result.current.authStatus).toBe("unknown");
    expect(result.current.bubbles).toHaveLength(1);
    expect(getMe).not.toHaveBeenCalled();
    expect(getChatbotHistory).not.toHaveBeenCalled();
  });

  test("비로그인 사용자는 guest 상태가 되고 챗봇 데이터를 조회하지 않는다", async () => {
    (getMe as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useChatbot(true));

    await waitFor(() => expect(result.current.authStatus).toBe("guest"));
    expect(getChatbotHistory).not.toHaveBeenCalled();
    expect(getSuggestedQuestions).not.toHaveBeenCalled();
  });

  test("로그인 사용자의 최신순 히스토리를 오래된 순서의 버블로 변환한다", async () => {
    (getChatbotHistory as jest.Mock).mockResolvedValue({
      ...emptyHistory,
      content: [
        { id: "INQ_15", type: "INQUIRY", question: "최근 문의", answer: "답변 완료", status: "ANSWERED", createdAt: "2026-07-22", isAnswerUnread: true },
        { id: "CHAT_1", type: "CHATBOT", question: "이전 질문", answer: "이전 답변", status: "COMPLETED", createdAt: "2026-07-21", isAnswerUnread: false },
      ],
    });
    (getSuggestedQuestions as jest.Mock).mockResolvedValue([
      { suggestedQuestionId: 1, question: "환불은 어떻게 하나요?" },
    ]);
    const { result } = renderHook(() => useChatbot(true));

    await waitFor(() => expect(result.current.bubbles).toHaveLength(5));
    expect(result.current.bubbles.map((bubble) => bubble.content)).toEqual([
      expect.stringContaining("알고가 AI 여행 도우미"),
      "이전 질문", "이전 답변", "최근 문의", "답변 완료",
    ]);
    expect(result.current.bubbles[4]).toEqual(
      expect.objectContaining({ inquiryId: 15, isAnswerUnread: true })
    );
    expect(result.current.suggestions).toHaveLength(1);
  });

  test("답변 대기 문의를 접수 안내 버블로 변환한다", async () => {
    (getChatbotHistory as jest.Mock).mockResolvedValue({
      ...emptyHistory,
      content: [
        { id: "INQ_3", type: "INQUIRY", question: "문의 내용", answer: null, status: "PENDING", createdAt: "2026-07-22", isAnswerUnread: false },
      ],
    });
    const { result } = renderHook(() => useChatbot(true));

    await waitFor(() => expect(result.current.bubbles).toHaveLength(3));
    expect(result.current.bubbles[2].content).toBe(
      "문의가 접수되었습니다. 답변이 등록되면 알려드릴게요."
    );
  });

  test("직접 질문을 전송하고 사용자·도우미 버블을 추가한다", async () => {
    (askChatbot as jest.Mock).mockResolvedValue(normalAnswer);
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    act(() => result.current.setInput("  예약 취소 방법  "));
    await act(async () => result.current.send());

    expect(askChatbot).toHaveBeenCalledWith("예약 취소 방법");
    expect(result.current.input).toBe("");
    expect(result.current.bubbles.slice(-2).map((bubble) => bubble.content)).toEqual([
      "예약 취소 방법", normalAnswer.answer,
    ]);
    expect(result.current.isSending).toBe(false);
  });

  test("빈 질문은 전송하지 않는다", async () => {
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    act(() => result.current.setInput("   "));
    await act(async () => result.current.send());
    expect(askChatbot).not.toHaveBeenCalled();
  });

  test("직접 질문 실패를 REJECTED 도우미 버블로 표시한다", async () => {
    (askChatbot as jest.Mock).mockRejectedValue(new Error("답변 서버 오류"));
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    act(() => result.current.setInput("질문"));
    await act(async () => result.current.send());

    expect(result.current.bubbles.at(-1)).toEqual(
      expect.objectContaining({ content: "답변 서버 오류", mode: "REJECTED" })
    );
  });

  test("레이트리밋 응답의 잠금 시간을 설정하고 카운트다운한다", async () => {
    jest.useFakeTimers();
    (askChatbot as jest.Mock).mockResolvedValue({
      ...normalAnswer, isSuccess: false, mode: "RATE_LIMITED", retryAfterSeconds: 2,
    });
    const { result } = renderHook(() => useChatbot(true));
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    act(() => result.current.setInput("질문"));
    await act(async () => result.current.send());
    expect(result.current.lockSeconds).toBe(2);

    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.lockSeconds).toBe(1);
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.lockSeconds).toBe(0);
  });

  test("상담원 인계 응답은 문의 화면과 상담 내용을 준비한다", async () => {
    (askChatbot as jest.Mock).mockResolvedValue({
      ...normalAnswer,
      mode: "AGENT_HANDOFF",
      handoffSummary: "예약 변경 문의",
      handoffInquiry: "예약 날짜를 변경하고 싶습니다.",
    });
    (getInquiryCategories as jest.Mock).mockResolvedValue([
      { code: "RESERVATION", description: "예약" },
    ]);
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    act(() => result.current.setInput("날짜 변경"));
    await act(async () => result.current.send());

    expect(result.current.view).toBe("inquiry");
    expect(result.current.handoffSummary).toBe("예약 변경 문의");
    expect(result.current.inquiryContent).toBe("예약 날짜를 변경하고 싶습니다.");
    expect(result.current.categories).toHaveLength(1);
  });

  test("문의 폼을 선검증하고 정상 payload는 공백을 제거해 등록한다", async () => {
    (createInquiry as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    await act(async () => result.current.submitInquiry());
    expect(result.current.formError).toBe("문의 유형을 선택해 주세요.");
    expect(createInquiry).not.toHaveBeenCalled();

    act(() => {
      result.current.setInquiryCategory("REFUND");
      result.current.setInquiryTitle("  환불 문의  ");
      result.current.setInquiryContent("  환불 상태가 궁금합니다.  ");
    });
    await act(async () => result.current.submitInquiry());

    expect(createInquiry).toHaveBeenCalledWith({
      category: "REFUND",
      title: "환불 문의",
      content: "환불 상태가 궁금합니다.",
    });
    expect(result.current.view).toBe("chat");
    expect(result.current.inquiryTitle).toBe("");
    expect(result.current.inquiryContent).toBe("");
  });

  test("읽지 않은 문의 답변을 API 실패와 무관하게 확인 처리한다", async () => {
    (getChatbotHistory as jest.Mock).mockResolvedValue({
      ...emptyHistory,
      content: [
        { id: "INQ_15", type: "INQUIRY", question: "문의", answer: "답변", status: "ANSWERED", createdAt: "2026-07-22", isAnswerUnread: true },
      ],
    });
    (markInquiryAnswerRead as jest.Mock).mockRejectedValue(new Error("실패"));
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.bubbles).toHaveLength(3));
    const answerBubble = result.current.bubbles[2];

    await act(async () => result.current.confirmInquiryAnswer(answerBubble.key, 15));

    expect(markInquiryAnswerRead).toHaveBeenCalledWith(15);
    expect(result.current.bubbles[2]).toEqual(
      expect.objectContaining({ isAnswerUnread: false, inquiryId: undefined })
    );
  });

  test("예상 질문을 전송해 질문과 답변 버블을 추가한다", async () => {
    (askSuggestedQuestion as jest.Mock).mockResolvedValue(normalAnswer);
    const suggestion = { suggestedQuestionId: 7, question: "환불 규정" };
    const { result } = renderHook(() => useChatbot(true));
    await waitFor(() => expect(result.current.authStatus).toBe("authed"));

    await act(async () => result.current.askSuggested(suggestion));

    expect(askSuggestedQuestion).toHaveBeenCalledWith(7);
    expect(result.current.bubbles.slice(-2).map((bubble) => bubble.content)).toEqual([
      "환불 규정", normalAnswer.answer,
    ]);
  });
});
