import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommunityCommentForm from "@/features/community/components/PostDetail/CommunityCommentForm";

describe("CommunityCommentForm 컴포넌트 테스트", () => {
  test("댓글 입력 폼이 기본 문구로 렌더링된다", () => {
    render(<CommunityCommentForm value="" onChange={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByPlaceholderText("댓글을 입력하세요...")).toBeVisible();
    expect(screen.getByRole("button", { name: "등록" })).toBeVisible();
  });

  test("placeholder와 submitLabel을 전달하면 해당 문구가 보인다", () => {
    render(
      <CommunityCommentForm
        value=""
        placeholder="답글을 입력하세요"
        submitLabel="답글 등록"
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("답글을 입력하세요")).toBeVisible();
    expect(screen.getByRole("button", { name: "답글 등록" })).toBeVisible();
  });

  test("입력값이 비어있으면 등록 버튼이 비활성화된다", () => {
    render(<CommunityCommentForm value="" onChange={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByRole("button", { name: "등록" })).toBeDisabled();
  });

  test("입력값이 공백만 있으면 등록 버튼이 비활성화된다", () => {
    render(<CommunityCommentForm value="   " onChange={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByRole("button", { name: "등록" })).toBeDisabled();
  });

  test("댓글을 입력하면 onChange가 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<CommunityCommentForm value="" onChange={onChange} onSubmit={jest.fn()} />);

    await user.type(screen.getByPlaceholderText("댓글을 입력하세요..."), "좋은 글이네요");

    expect(onChange).toHaveBeenCalledWith("좋");
    expect(onChange).toHaveBeenCalledWith("요");
  });

  test("입력값이 있으면 등록 버튼이 활성화되고 제출 시 onSubmit이 호출된다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <CommunityCommentForm value="좋은 글이네요" onChange={jest.fn()} onSubmit={onSubmit} />
    );

    const submitButton = screen.getByRole("button", { name: "등록" });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("disabled 상태이면 입력창과 버튼이 비활성화되고 등록 중 문구가 보인다", () => {
    render(
      <CommunityCommentForm
        value="좋은 글이네요"
        disabled
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("댓글을 입력하세요...")).toBeDisabled();
    expect(screen.getByRole("button", { name: "등록 중" })).toBeDisabled();
  });
});
