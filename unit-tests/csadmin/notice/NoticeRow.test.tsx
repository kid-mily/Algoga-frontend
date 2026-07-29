/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoticeRow from "@/features/csadmin/notice/components/NoticeRow";
import type { AdminNotice } from "@/features/csadmin/notice/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));

const notice: AdminNotice = {
  noticeId: 3,
  displayId: "N003",
  title: "이벤트 공지",
  content: "내용",
  tag: "EVENT",
  tagLabel: "이벤트",
  createdAt: "2026.07.16",
  updatedAt: "2026.07.16",
  viewCount: 5,
};

describe("NoticeRow 컴포넌트 테스트", () => {
  test("공지사항 행 정보를 렌더링한다", () => {
    render(
      <table>
        <tbody>
          <NoticeRow notice={notice} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    expect(screen.getByText("N003")).toBeVisible();
    expect(screen.getByText("이벤트")).toBeVisible();
    expect(screen.getByText("이벤트 공지")).toBeVisible();
    expect(screen.getByText("2026.07.16")).toBeVisible();
  });

  test("수정 링크와 삭제 버튼을 제공한다", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <table>
        <tbody>
          <NoticeRow notice={notice} onDelete={onDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByLabelText("수정: 공지사항 3")).toHaveAttribute(
      "href",
      "/csadmin/notice/3"
    );

    await user.click(screen.getByLabelText("삭제: 공지사항 3"));

    expect(onDelete).toHaveBeenCalledWith(3);
  });
});
