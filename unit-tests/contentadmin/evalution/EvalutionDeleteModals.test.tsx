import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EvalutionDeleteModals from "@/features/contentmanage/evalution/components/EvalutionDeleteModals";
import type { EvalutionQuestionSet } from "@/features/contentmanage/evalution/types";

const questionSet: EvalutionQuestionSet = {
  id: 1,
  countryId: 1,
  country: "일본",
  questions: [],
};

describe("EvalutionDeleteModals 컴포넌트 테스트", () => {
  test("삭제 모달에서 삭제와 취소 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirmDelete = jest.fn();
    const onCancelDelete = jest.fn();

    render(
      <EvalutionDeleteModals
        deleteTarget={questionSet}
        deleteCompleteOpen={false}
        isProcessing={false}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={onCancelDelete}
        onCloseComplete={jest.fn()}
      />
    );

    expect(screen.getByText("진단평가 세트 삭제")).toBeVisible();
    expect(screen.getByText("선택한 진단평가 5문항 세트를 삭제하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "삭제" }));
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
    expect(onCancelDelete).toHaveBeenCalledTimes(1);
  });

  test("삭제 완료 모달 확인 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onCloseComplete = jest.fn();

    render(
      <EvalutionDeleteModals
        deleteTarget={null}
        deleteCompleteOpen
        isProcessing={false}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
        onCloseComplete={onCloseComplete}
      />
    );

    expect(screen.getByText("삭제 완료")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onCloseComplete).toHaveBeenCalledTimes(1);
  });

  test("처리 중이면 삭제 버튼이 비활성화된다", () => {
    render(
      <EvalutionDeleteModals
        deleteTarget={questionSet}
        deleteCompleteOpen={false}
        isProcessing
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
        onCloseComplete={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "처리 중..." })).toBeDisabled();
  });
});
