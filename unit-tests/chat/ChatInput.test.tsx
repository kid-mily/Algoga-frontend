import ChatInput from "@/features/chat/components/ChatInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ChatInput 컴포넌트 테스트", () => {
  test("채팅 입력창과 전송 버튼이 정상적으로 렌더링된다", () => {
    
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    expect(screen.getByLabelText("메시지 입력")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "전송" })).toBeInTheDocument();
  });

  test("메시지를 입력하지 않으면 전송 버튼이 비활성화된다", () => {

    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  });

  test("메시지를 입력하면 전송 버튼이 활성화된다", async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    await user.type(screen.getByLabelText("메시지 입력"), "안녕하세요");
    expect(screen.getByRole("button", { name: "전송" })).toBeEnabled();
  });

  test("전송 버튼을 누르면 입력한 메시지가 onSend로 전달된다", async () => {

    const user = userEvent.setup();
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    await user.type(screen.getByLabelText("메시지 입력"), "채팅 테스트");
    await user.click(screen.getByRole("button", { name: "전송" }));
    expect(onSend).toHaveBeenCalledWith("채팅 테스트");
  });

  test("메시지를 전송하면 입력창이 비워진다", async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const input = screen.getByLabelText("메시지 입력");
    await user.type(input, "보낼 메시지");
    await user.click(screen.getByRole("button", { name: "전송" }));
    expect(input).toHaveValue("");
  });

  test("공백 메시지는 전송되지 않는다", async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    await user.type(screen.getByLabelText("메시지 입력"), "   ");
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
    expect(onSend).not.toHaveBeenCalled();
  });

  test("입력 중이면 onTypingChange(true)가 호출된다", async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();
    const onTypingChange = jest.fn();
    render(<ChatInput onSend={onSend} onTypingChange={onTypingChange} />);
    await user.type(screen.getByLabelText("메시지 입력"), "ㅎ");
    expect(onTypingChange).toHaveBeenCalledWith(true);
  });

  test("메시지를 전송하면 onTypingChange(false)가 호출된다", async () => {
    // Given
    const user = userEvent.setup();
    const onSend = jest.fn();
    const onTypingChange = jest.fn();
    render(<ChatInput onSend={onSend} onTypingChange={onTypingChange} />);
    await user.type(screen.getByLabelText("메시지 입력"), "안녕");
    await user.click(screen.getByRole("button", { name: "전송" }));
    expect(onTypingChange).toHaveBeenCalledWith(false);
  });

  test("disabled 상태면 입력창과 전송 버튼이 비활성화된다", () => {
    
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} disabled />);
    expect(screen.getByLabelText("메시지 입력")).toBeDisabled();
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();
  });
});