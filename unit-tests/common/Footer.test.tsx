import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "@/features/common/components/Footer";

describe("Footer", () => {
  test("서비스와 고객지원 메뉴를 올바른 경로로 연결한다", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "여행 강의" })).toHaveAttribute(
      "href",
      "/classroom"
    );
    expect(screen.getByRole("link", { name: "AI 일정 추천" })).toHaveAttribute(
      "href",
      "/aischedule"
    );
    expect(screen.getByRole("link", { name: "커뮤니티" })).toHaveAttribute(
      "href",
      "/community"
    );
    expect(screen.getByRole("link", { name: "공지사항" })).toHaveAttribute(
      "href",
      "/notice"
    );
  });

  test("1:1 문의를 누르면 문의 열기 이벤트를 발생시킨다", async () => {
    const user = userEvent.setup();
    const listener = jest.fn();
    window.addEventListener("algoga-open-inquiry", listener);

    render(<Footer />);
    await user.click(screen.getByRole("button", { name: "1:1 문의" }));

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("algoga-open-inquiry", listener);
  });

  test("이용약관과 개인정보처리방침을 모달로 보여준다", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole("button", { name: "이용약관" }));
    expect(screen.getByRole("dialog", { name: "이용약관" })).toBeVisible();
    expect(screen.getByText("제1조 목적")).toBeVisible();
    expect(screen.getByText("제7조 커뮤니티 게시글 조회수")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "이용약관 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "개인정보처리방침" })
    );
    expect(
      screen.getByRole("dialog", { name: "개인정보처리방침" })
    ).toBeVisible();
    expect(screen.getByText("1. 개인정보 처리 목적")).toBeVisible();
    expect(
      screen.getByText(/비로그인 이용자의 접속 IP를 처리합니다/)
    ).toBeVisible();
  });
});
