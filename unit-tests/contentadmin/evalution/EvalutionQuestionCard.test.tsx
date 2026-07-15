import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalutionQuestionCard from "@/features/contentmanage/evalution/components/EvalutionQuestionCard";
import type { EvalutionQuestionSet } from "@/features/contentmanage/evalution/types";

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

const questionSet: EvalutionQuestionSet = {
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
    {
      id: 12,
      countryId: 1,
      questionOrder: 2,
      country: "일본",
      title: "도쿄 대표 공항은?",
      options: ["나리타", "인천", "김포", "제주"],
      answerIndex: 0,
      explanation: "",
    },
  ],
};

describe("EvalutionQuestionCard 컴포넌트 테스트", () => {
  test("진단평가 세트 정보를 렌더링한다", () => {
    render(
      <EvalutionQuestionCard
        questionSet={questionSet}
        order={1}
        isExpanded={false}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("01")).toBeVisible();
    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("일본 진단평가 2문항 세트")).toBeVisible();
    expect(screen.queryByText("일본 입국 전 필요한 것은?")).not.toBeInTheDocument();
  });

  test("펼친 상태에서는 문항과 정답, 해설을 표시한다", () => {
    render(
      <EvalutionQuestionCard
        questionSet={questionSet}
        order={1}
        isExpanded
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("1. 일본 입국 전 필요한 것은?")).toBeVisible();
    expect(screen.getByText("정답: 여권")).toBeVisible();
    expect(screen.getByText("해설: 여권이 필요합니다.")).toBeVisible();
  });

  test("상세 보기, 수정, 삭제 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <EvalutionQuestionCard
        questionSet={questionSet}
        order={1}
        isExpanded={false}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 상세 보기" }));
    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 수정" }));
    await user.click(screen.getByRole("button", { name: "일본 진단평가 세트 삭제" }));

    expect(onToggle).toHaveBeenCalledWith(11);
    expect(onEdit).toHaveBeenCalledWith(11);
    expect(onDelete).toHaveBeenCalledWith(questionSet);
  });
});
