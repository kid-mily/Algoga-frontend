import { api } from "@/lib/api";

type ChatbotServiceModule = typeof import("@/features/services/chatbot.service");

let askChatbot: ChatbotServiceModule["askChatbot"];
let askSuggestedQuestion: ChatbotServiceModule["askSuggestedQuestion"];
let getChatbotHistory: ChatbotServiceModule["getChatbotHistory"];
let getSuggestedQuestions: ChatbotServiceModule["getSuggestedQuestions"];

jest.mock("@/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response && typeof response === "object" && "data" in response
      ? response.data
      : response,
}));

const answer = {
  answer: "예약 내역에서 취소할 수 있습니다.",
  isSuccess: true,
  mode: "NORMAL" as const,
  handoffSummary: null,
  handoffInquiry: null,
};

const mockFetchResponse = ({
  payload,
  status = 200,
  retryAfter = null,
  jsonRejects = false,
}: {
  payload?: unknown;
  status?: number;
  retryAfter?: string | null;
  jsonRejects?: boolean;
}) => ({
  status,
  headers: { get: jest.fn().mockReturnValue(retryAfter) },
  json: jsonRejects
    ? jest.fn().mockRejectedValue(new Error("invalid json"))
    : jest.fn().mockResolvedValue(payload),
});

describe("사용자 챗봇 서비스 테스트", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
    const service = await import("@/features/services/chatbot.service");

    askChatbot = service.askChatbot;
    askSuggestedQuestion = service.askSuggestedQuestion;
    getChatbotHistory = service.getChatbotHistory;
    getSuggestedQuestions = service.getSuggestedQuestions;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("통합 히스토리를 페이지 조건과 함께 조회한다", async () => {
    const controller = new AbortController();
    const page = {
      content: [], page: 1, size: 10, totalElements: 0,
      totalPages: 0, first: true, last: true,
    };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: page });

    await expect(getChatbotHistory(1, 10, controller.signal)).resolves.toEqual(page);
    expect(api.get).toHaveBeenCalledWith("/api/v1/chatbot/history", {
      params: { page: 1, size: 10 },
      cache: "no-store",
      suppressGlobalError: true,
      signal: controller.signal,
    });
  });

  test("예상 질문 목록을 조회하고 null이면 빈 배열을 반환한다", async () => {
    const suggestions = [{ suggestedQuestionId: 1, question: "환불은 어떻게 하나요?" }];
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: suggestions })
      .mockResolvedValueOnce({ data: null });

    await expect(getSuggestedQuestions()).resolves.toEqual(suggestions);
    await expect(getSuggestedQuestions()).resolves.toEqual([]);
  });

  test("예상 질문 ID를 전송하고 답변을 반환한다", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: answer });

    await expect(askSuggestedQuestion(7)).resolves.toEqual(answer);
    expect(api.post).toHaveBeenCalledWith(
      "/api/v1/chatbot/suggested-questions/ask",
      { suggestedQuestionId: 7 },
      { suppressGlobalError: true }
    );
  });

  test("직접 질문을 인증 쿠키와 JSON body로 전송하고 NORMAL 응답을 반환한다", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({ payload: { data: answer } })
    );

    await expect(askChatbot("예약 취소 방법")).resolves.toEqual(answer);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.test/api/v1/chatbot/ask",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: "예약 취소 방법" }),
      }
    );
  });

  test("AGENT_HANDOFF 응답의 상담 요약과 문의 내용을 유지한다", async () => {
    const handoff = {
      ...answer,
      mode: "AGENT_HANDOFF" as const,
      handoffSummary: "예약 변경 문의",
      handoffInquiry: "예약 날짜를 변경하고 싶습니다.",
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({ payload: { data: handoff } })
    );

    await expect(askChatbot("날짜를 바꿔줘")).resolves.toEqual(handoff);
  });

  test("RATE_LIMITED 응답에 Retry-After 초를 포함한다", async () => {
    const limited = { ...answer, isSuccess: false, mode: "RATE_LIMITED" as const };
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({ payload: { data: limited }, status: 429, retryAfter: "5" })
    );

    await expect(askChatbot("질문")).resolves.toEqual({
      ...limited,
      retryAfterSeconds: 5,
    });
  });

  test("Retry-After가 유효한 숫자가 아니면 잠금 시간을 생략한다", async () => {
    const limited = { ...answer, isSuccess: false, mode: "RATE_LIMITED" as const };
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({ payload: { data: limited }, status: 429, retryAfter: "invalid" })
    );

    await expect(askChatbot("질문")).resolves.toEqual({
      ...limited,
      retryAfterSeconds: undefined,
    });
  });

  test("일반 오류 응답을 상태와 코드가 있는 ChatbotApiError로 변환한다", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({
        payload: { errorCode: "CHAT_001", message: "일일 질문 한도를 초과했습니다." },
        status: 429,
      })
    );

    await expect(askChatbot("질문")).rejects.toMatchObject({
      name: "ChatbotApiError",
      message: "일일 질문 한도를 초과했습니다.",
      status: 429,
      code: "CHAT_001",
    });
  });

  test("JSON 파싱에 실패하면 기본 오류 메시지를 사용한다", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse({ status: 500, jsonRejects: true })
    );

    await expect(askChatbot("질문")).rejects.toEqual(
      expect.objectContaining({
        message: "챗봇 답변에 실패했습니다.",
        status: 500,
      })
    );
  });
});
