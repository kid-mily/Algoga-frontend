import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import AiChatbotWidget from "@/features/chatbot/components/AiChatbotWidget";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/features/chatbot/hooks/useChatbot", () => ({ useChatbot: jest.fn() }));

const createChatbotMock = (overrides: Record<string, unknown> = {}) => ({
  authStatus: "authed",
  view: "chat",
  bubbles: [],
  suggestions: [],
  input: "",
  setInput: jest.fn(),
  isSending: false,
  lockSeconds: 0,
  send: jest.fn(),
  askSuggested: jest.fn(),
  categories: [],
  inquiryCategory: "",
  setInquiryCategory: jest.fn(),
  inquiryTitle: "",
  setInquiryTitle: jest.fn(),
  inquiryContent: "",
  setInquiryContent: jest.fn(),
  isSubmitting: false,
  formError: "",
  handoffSummary: null,
  openInquiry: jest.fn(),
  backToChat: jest.fn(),
  submitInquiry: jest.fn(),
  confirmInquiryAnswer: jest.fn(),
  ...overrides,
});

const openWidget = () => {
  fireEvent.click(screen.getByRole("button", { name: "알고가 AI 열기" }));
};

describe("AiChatbotWidget 컴포넌트 테스트", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/");
    (useChatbot as jest.Mock).mockReturnValue(createChatbotMock());
  });

  test.each([
    "/auth/login",
    "/contentadmin/course",
    "/csadmin/inquiry",
    "/moneyadmin/payment",
    "/statisticadmin/repurchase-ltv",
    "/superadmin",
  ])("관리자·인증 경로 %s에서는 챗봇을 숨긴다", (pathname) => {
    (usePathname as jest.Mock).mockReturnValue(pathname);
    render(<AiChatbotWidget />);

    expect(screen.queryByRole("button", { name: "알고가 AI 열기" })).not.toBeInTheDocument();
  });

  test("일반 사용자 페이지에서 챗봇을 열고 닫는다", () => {
    render(<AiChatbotWidget />);

    openWidget();
    expect(screen.getByRole("heading", { name: "알고가 AI" })).toBeVisible();

    const closeButtons = screen.getAllByRole("button", { name: "알고가 AI 닫기" });
    fireEvent.click(closeButtons[0]);
    expect(screen.queryByRole("heading", { name: "알고가 AI" })).not.toBeInTheDocument();
  });

  test("인증 확인 중과 비로그인 안내를 표시한다", () => {
    (useChatbot as jest.Mock).mockReturnValue(createChatbotMock({ authStatus: "unknown" }));
    const { rerender } = render(<AiChatbotWidget />);
    openWidget();
    expect(screen.getByText("불러오는 중입니다...")).toBeVisible();

    (useChatbot as jest.Mock).mockReturnValue(createChatbotMock({ authStatus: "guest" }));
    rerender(<AiChatbotWidget />);
    expect(screen.getByText(/로그인 후 이용할 수 있습니다/)).toBeVisible();
    expect(screen.getByRole("link", { name: "로그인하러 가기" })).toHaveAttribute(
      "href",
      "/auth/login"
    );
  });

  test("대화 버블과 읽지 않은 문의 답변 확인 버튼을 표시한다", () => {
    const confirmInquiryAnswer = jest.fn();
    (useChatbot as jest.Mock).mockReturnValue(
      createChatbotMock({
        bubbles: [
          { key: "user-1", role: "user", content: "질문" },
          { key: "INQ_15-a", role: "assistant", content: "문의 답변", inquiryId: 15, isAnswerUnread: true },
        ],
        confirmInquiryAnswer,
      })
    );
    render(<AiChatbotWidget />);
    openWidget();

    expect(screen.getByText("질문")).toBeVisible();
    expect(screen.getByText("문의 답변")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "답변 완료 · 확인하기" }));
    expect(confirmInquiryAnswer).toHaveBeenCalledWith("INQ_15-a", 15);
  });

  test("예상 질문과 1:1 문의 버튼 클릭을 훅에 전달한다", () => {
    const suggestion = { suggestedQuestionId: 7, question: "환불 규정" };
    const askSuggested = jest.fn();
    const openInquiry = jest.fn();
    (useChatbot as jest.Mock).mockReturnValue(
      createChatbotMock({ suggestions: [suggestion], askSuggested, openInquiry })
    );
    render(<AiChatbotWidget />);
    openWidget();

    fireEvent.click(screen.getByRole("button", { name: "환불 규정" }));
    expect(askSuggested).toHaveBeenCalledWith(suggestion);
    fireEvent.click(screen.getByRole("button", { name: "답변이 부족하면 1:1 문의하기 →" }));
    expect(openInquiry).toHaveBeenCalledTimes(1);
  });

  test("메시지 입력과 form 제출을 훅에 전달한다", () => {
    const setInput = jest.fn();
    const send = jest.fn();
    (useChatbot as jest.Mock).mockReturnValue(
      createChatbotMock({ input: "예약 문의", setInput, send })
    );
    render(<AiChatbotWidget />);
    openWidget();

    fireEvent.change(screen.getByPlaceholderText("메시지를 입력하세요..."), {
      target: { value: "변경된 질문" },
    });
    expect(setInput).toHaveBeenCalledWith("변경된 질문");
    fireEvent.click(screen.getByRole("button", { name: "메시지 보내기" }));
    expect(send).toHaveBeenCalledTimes(1);
  });

  test("레이트리밋 중에는 남은 시간을 표시하고 입력을 비활성화한다", () => {
    (useChatbot as jest.Mock).mockReturnValue(
      createChatbotMock({ input: "질문", lockSeconds: 3 })
    );
    render(<AiChatbotWidget />);
    openWidget();

    expect(screen.getByText("요청이 많아요. 3초 후 다시 시도해 주세요.")).toBeVisible();
    expect(screen.getByPlaceholderText("3초 후 입력 가능")).toBeDisabled();
    expect(screen.getByRole("button", { name: "메시지 보내기" })).toBeDisabled();
  });

  test("문의 화면의 입력과 제출 및 뒤로가기를 훅에 전달한다", () => {
    const setInquiryCategory = jest.fn();
    const setInquiryTitle = jest.fn();
    const setInquiryContent = jest.fn();
    const submitInquiry = jest.fn();
    const backToChat = jest.fn();
    (useChatbot as jest.Mock).mockReturnValue(
      createChatbotMock({
        view: "inquiry",
        categories: [{ code: "REFUND", description: "환불" }],
        handoffSummary: "환불 관련 상담이 필요합니다.",
        formError: "내용을 5자 이상 입력해 주세요.",
        setInquiryCategory,
        setInquiryTitle,
        setInquiryContent,
        submitInquiry,
        backToChat,
      })
    );
    render(<AiChatbotWidget />);
    openWidget();

    expect(screen.getByRole("heading", { name: "1:1 문의" })).toBeVisible();
    expect(screen.getByText("환불 관련 상담이 필요합니다.")).toBeVisible();
    expect(screen.getByText("내용을 5자 이상 입력해 주세요.")).toBeVisible();
    fireEvent.change(screen.getByLabelText("문의 유형"), { target: { value: "REFUND" } });
    fireEvent.change(screen.getByPlaceholderText("문의 제목을 입력하세요 (2자 이상)"), { target: { value: "환불 문의" } });
    fireEvent.change(screen.getByPlaceholderText("문의 내용을 입력하세요 (5자 이상)"), { target: { value: "환불 상태 확인" } });
    expect(setInquiryCategory).toHaveBeenCalledWith("REFUND");
    expect(setInquiryTitle).toHaveBeenCalledWith("환불 문의");
    expect(setInquiryContent).toHaveBeenCalledWith("환불 상태 확인");

    fireEvent.click(screen.getByRole("button", { name: "문의 등록" }));
    expect(submitInquiry).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "채팅으로 돌아가기" }));
    expect(backToChat).toHaveBeenCalledTimes(1);
  });
});
