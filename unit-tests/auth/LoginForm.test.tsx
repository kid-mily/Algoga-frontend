import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/features/auth/components/LoginForm";
import { login } from "@/features/services/auth.service";

jest.mock("@/features/services/auth.service", () => ({
  login: jest.fn(),
}));

const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

describe("LoginForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = "https://kidmily.kro.kr";
  });

  test("로그인 폼이 정상적으로 렌더링된다", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("아이디를 입력해주세요")).toBeVisible();
    expect(screen.getByPlaceholderText("비밀번호를 입력해주세요")).toBeVisible();
    expect(screen.getByRole("button", { name: "로그인" })).toBeVisible();
  });

  test("아이디와 비밀번호를 입력하지 않고 로그인하면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("아이디를 입력해주세요.")).toBeVisible();
    expect(screen.getByText("비밀번호를 입력해주세요.")).toBeVisible();
  });

  test("아이디만 입력하지 않으면 아이디 입력 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요"),
      "password123"
    );

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("아이디를 입력해주세요.")).toBeVisible();
  });

  test("비밀번호만 입력하지 않으면 비밀번호 입력 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("아이디를 입력해주세요"), "testuser");

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(screen.getByText("비밀번호를 입력해주세요.")).toBeVisible();
  });

  test("아이디 입력값이 공백이면 아이디 입력 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("아이디를 입력해주세요"), "   ");

    expect(screen.getByText("아이디를 입력해주세요.")).toBeVisible();
  });

  test("비밀번호를 입력했다가 비우면 비밀번호 입력 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");

    await user.type(passwordInput, "password123");
    await user.clear(passwordInput);

    expect(screen.getByText("비밀번호를 입력해주세요.")).toBeVisible();
  });

  test("로그인 실패 시 아이디 또는 비밀번호 오류 문구가 보인다", async () => {
    const user = userEvent.setup();

    (login as jest.Mock).mockRejectedValueOnce(
      new Error("존재하지 않는 계정입니다.")
    );

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("아이디를 입력해주세요"), "wronguser");
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요"),
      "wrongpassword"
    );

    await user.click(screen.getByRole("button", { name: "로그인" }));

    const errorMessages = await screen.findAllByText(
      "아이디 또는 비밀번호가 틀렸습니다."
    );

    expect(errorMessages).toHaveLength(2);
    expect(errorMessages[0]).toBeVisible();
    expect(errorMessages[1]).toBeVisible();
  });

  test("로그인 성공 시 로그인 API를 호출한다", async () => {
    const user = userEvent.setup();

    (login as jest.Mock).mockResolvedValueOnce({
      requiresPasswordChange: false,
    });

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("아이디를 입력해주세요"), "testuser");
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요"),
      "password123"
    );

    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  test("임시 비밀번호 변경이 필요하면 새 비밀번호 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    (login as jest.Mock).mockResolvedValueOnce({
      requiresPasswordChange: true,
    });

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("아이디를 입력해주세요"), "testuser");
    await user.type(
      screen.getByPlaceholderText("비밀번호를 입력해주세요"),
      "password123"
    );

    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(pushMock).toHaveBeenCalledWith("/auth/login/newpw");
      expect(pushMock).not.toHaveBeenCalledWith("/");
    });
  });

  test("비밀번호 보기 버튼을 누르면 비밀번호 입력 타입이 바뀐다", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    const showPasswordButton = screen.getByRole("button", { name: "비밀번호 보기" });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(showPasswordButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "비밀번호 숨기기" })).toBeVisible();
  });
});
