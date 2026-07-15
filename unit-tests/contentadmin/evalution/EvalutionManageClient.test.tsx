import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalutionManageClient from "@/features/contentmanage/evalution/components/EvalutionManageClient";
import { useEvalutionQuestionList } from "@/features/contentmanage/evalution/hooks/useEvalutionQuestionList";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/features/contentmanage/evalution/hooks/useEvalutionQuestionList", () => ({
  useEvalutionQuestionList: jest.fn(),
}));

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

const questionSet = {
  id: 11,
  countryId: 1,
  country: "일본",
  questions: [
    {
      id: 11,
      countryId: 1,
      questionOrder: 1,
      country: "일본",
      title: "일본 입국 전 필요한 것은?",
      options: ["여권", "우산", "노트", "마우스"],
      answerIndex: 0,
      explanation: "여권이 필요합니다.",
    },
  ],
};

const baseHookValue = {
  activeTab: "questions",
  results: [
    {
      resultId: 1,
      userName: "김알고",
      userId: "U001",
      level: "초급",
      score: 80,
      submittedAt: "2026.07.01",
    },
  ],
  countries: [
    {
      countryId: 1,
      countryName: "일본",
    },
  ],
  selectedCountryId: 1,
  expandedId: null,
  filteredQuestionSets: [questionSet],
  deleteTarget: null,
  deleteCompleteOpen: false,
  isLoadingQuestions: false,
  isLoadingResults: false,
  isProcessing: false,
  error: "",
  setActiveTab: jest.fn(),
  setSelectedCountryId: jest.fn(),
  setDeleteTarget: jest.fn(),
  setDeleteCompleteOpen: jest.fn(),
  toggleQuestionSet: jest.fn(),
  deleteQuestion: jest.fn(),
};

describe("EvalutionManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useEvalutionQuestionList as jest.Mock).mockReturnValue(baseHookValue);
  });

  test("진단평가 문제 관리 화면을 렌더링한다", () => {
    render(<EvalutionManageClient />);

    expect(screen.getByText("진단평가 관리")).toBeVisible();
    expect(screen.getByText("사용자 수준을 파악하고 맞춤 강의를 추천하는 진단평가를 관리합니다")).toBeVisible();
    expect(screen.getByText("국가별 5문항 세트를 관리합니다")).toBeVisible();
    expect(screen.getByText("일본 진단평가 1문항 세트")).toBeVisible();
  });

  test("탭과 국가 필터 변경 콜백을 호출한다", async () => {
    const user = userEvent.setup();

    render(<EvalutionManageClient />);

    await user.click(screen.getByRole("tab", { name: "응답 결과" }));
    await user.click(screen.getByRole("button", { name: "일본" }));

    expect(baseHookValue.setActiveTab).toHaveBeenCalledWith("results");
    expect(baseHookValue.setSelectedCountryId).toHaveBeenCalledWith(1);
  });

  test("등록, 상세 보기, 수정, 삭제 흐름을 연결한다", async () => {
    const user = userEvent.setup();

    render(<EvalutionManageClient />);

    await user.click(screen.getByRole("button", { name: /문제 등록/ }));
    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 상세 보기" }));
    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 수정" }));
    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 삭제" }));

    expect(mockPush).toHaveBeenCalledWith("/contentadmin/evalution/new");
    expect(baseHookValue.toggleQuestionSet).toHaveBeenCalledWith(11);
    expect(mockPush).toHaveBeenCalledWith("/contentadmin/evalution/11/edit");
    expect(baseHookValue.setDeleteTarget).toHaveBeenCalledWith(questionSet);
  });

  test("응답 결과 탭에서는 결과 테이블을 표시한다", () => {
    (useEvalutionQuestionList as jest.Mock).mockReturnValue({
      ...baseHookValue,
      activeTab: "results",
    });

    render(<EvalutionManageClient />);

    expect(screen.getByText("#1")).toBeVisible();
    expect(screen.getByText("김알고")).toBeVisible();
    expect(screen.getByText("80점")).toBeVisible();
  });
});
