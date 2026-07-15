import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalutionFormClient from "@/features/contentmanage/evalution/components/EvalutionFormClient";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import {
  createEvalutionQuestion,
  deleteEvalutionQuestion,
  getEvalutionQuestion,
  getEvalutionQuestions,
  updateEvalutionQuestion,
} from "@/features/services/adminEvalution.service";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/features/services/adminCourse.service", () => ({
  getCourseCountries: jest.fn(),
}));

jest.mock("@/features/services/adminEvalution.service", () => ({
  createEvalutionQuestion: jest.fn(),
  deleteEvalutionQuestion: jest.fn(),
  getEvalutionQuestion: jest.fn(),
  getEvalutionQuestions: jest.fn(),
  updateEvalutionQuestion: jest.fn(),
}));

const countries = [
  {
    countryId: 1,
    countryName: "일본",
  },
];

const existingQuestions = Array.from({ length: 5 }, (_, index) => ({
  id: index + 11,
  countryId: 1,
  questionOrder: index + 1,
  country: "일본",
  title: `${index + 1}번 기존 문제`,
  options: ["정답", "오답1", "오답2", "오답3"],
  answerIndex: 0,
  explanation: `${index + 1}번 해설`,
}));

const fillFiveQuestions = async () => {
  const user = userEvent.setup();
  const questionInputs = screen.getAllByPlaceholderText(/\d번 문제를 입력하세요/);
  const optionInputs = screen.getAllByPlaceholderText(/선택지 \d/);

  for (const [index, input] of questionInputs.entries()) {
    fireEvent.change(input, {
      target: { value: `${index + 1}번 문제입니다` },
    });
  }

  for (const [index, input] of optionInputs.entries()) {
    fireEvent.change(input, {
      target: { value: `선택지 ${index + 1}` },
    });
  }

  await user.click(
    screen.getByRole("button", {
      name: "2번 문제의 3번 선택지를 정답으로 지정",
    })
  );

  return user;
};

describe("EvalutionFormClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCourseCountries as jest.Mock).mockResolvedValue(countries);
    (getEvalutionQuestions as jest.Mock).mockResolvedValue([]);
    (createEvalutionQuestion as jest.Mock).mockImplementation((payload) =>
      Promise.resolve({ ...payload, id: payload.questionOrder })
    );
    (updateEvalutionQuestion as jest.Mock).mockImplementation((id, payload) =>
      Promise.resolve({ ...payload, id })
    );
    (deleteEvalutionQuestion as jest.Mock).mockResolvedValue(undefined);
  });

  test("등록 모드에서 국가와 5개 문항 입력 폼을 렌더링한다", async () => {
    render(<EvalutionFormClient mode="create" />);

    expect(await screen.findByText("진단평가 세트 등록")).toBeVisible();
    expect(screen.getByDisplayValue("일본")).toBeVisible();
    expect(screen.getAllByText(/\d번 문제/)).toHaveLength(5);
  });

  test("필수 입력값이 없으면 등록 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(<EvalutionFormClient mode="create" />);

    await screen.findByText("진단평가 세트 등록");
    await user.click(screen.getByRole("button", { name: "5문항 세트 등록" }));

    expect(screen.getByText("1번 문제와 선택지를 모두 입력해주세요.")).toBeVisible();
    expect(createEvalutionQuestion).not.toHaveBeenCalled();
  });

  test("5문항을 입력하면 등록 API를 5번 호출하고 완료 모달을 표시한다", async () => {
    render(<EvalutionFormClient mode="create" />);

    await screen.findByText("진단평가 세트 등록");
    const user = await fillFiveQuestions();
    await user.click(screen.getByRole("button", { name: "5문항 세트 등록" }));

    await waitFor(() => {
      expect(createEvalutionQuestion).toHaveBeenCalledTimes(5);
    });
    expect(createEvalutionQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        countryId: 1,
        country: "일본",
        questionOrder: 1,
        title: "1번 문제입니다",
        options: ["선택지 1", "선택지 2", "선택지 3", "선택지 4"],
        answerIndex: 0,
      })
    );
    expect(createEvalutionQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        questionOrder: 2,
        answerIndex: 2,
      })
    );
    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("수정 모드에서 기존 문제를 초기값으로 렌더링한다", async () => {
    (getEvalutionQuestion as jest.Mock).mockResolvedValue(existingQuestions[0]);
    (getEvalutionQuestions as jest.Mock).mockResolvedValue(existingQuestions);

    render(<EvalutionFormClient mode="edit" questionId={11} />);

    expect(await screen.findByText("진단평가 세트 수정")).toBeVisible();
    expect(screen.getByDisplayValue("1번 기존 문제")).toBeVisible();
    expect(screen.getByDisplayValue("5번 기존 문제")).toBeVisible();
    expect(screen.getAllByDisplayValue("정답")).toHaveLength(5);
  });

  test("수정 모드 제출 시 확인 모달을 거쳐 수정 API를 호출한다", async () => {
    const user = userEvent.setup();
    (getEvalutionQuestion as jest.Mock).mockResolvedValue(existingQuestions[0]);
    (getEvalutionQuestions as jest.Mock).mockResolvedValue(existingQuestions);

    render(<EvalutionFormClient mode="edit" questionId={11} />);

    await screen.findByText("진단평가 세트 수정");
    await user.click(screen.getByRole("button", { name: "5문항 세트 수정" }));

    expect(screen.getByText("5개 문항 세트를 수정하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(updateEvalutionQuestion).toHaveBeenCalledTimes(5);
    });
    expect(updateEvalutionQuestion).toHaveBeenCalledWith(
      11,
      expect.objectContaining({
        countryId: 1,
        questionOrder: 1,
        title: "1번 기존 문제",
      })
    );
  });

  test("저장 실패 시 에러 메시지를 표시한다", async () => {
    render(<EvalutionFormClient mode="create" />);

    await screen.findByText("진단평가 세트 등록");
    const user = await fillFiveQuestions();
    (createEvalutionQuestion as jest.Mock).mockRejectedValueOnce(
      new Error("진단평가 저장 실패")
    );

    await user.click(screen.getByRole("button", { name: "5문항 세트 등록" }));

    expect(await screen.findByText("진단평가 저장 실패")).toBeVisible();
  });
});
