/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoticeManageClient from "@/features/csadmin/notice/components/NoticeManageClient";
import { useAdminNoticeList } from "@/features/csadmin/notice/hooks/useAdminNoticeList";
import type { AdminNotice } from "@/features/csadmin/notice/types";

jest.mock("@/features/csadmin/notice/hooks/useAdminNoticeList", () => ({
  useAdminNoticeList: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));

const notices: AdminNotice[] = [
  {
    noticeId: 1,
    displayId: "N001",
    title: "서비스 점검 안내",
    content: "점검 안내입니다.",
    tag: "MAINTENANCE",
    tagLabel: "점검",
    createdAt: "2026.07.16",
    updatedAt: "2026.07.16",
    viewCount: 12,
  },
];

const createHookValue = (override = {}) => ({
  searchKeyword: "",
  selectedTag: "ALL",
  filteredNotices: notices,
  totalCount: 1,
  isLoading: false,
  error: "",
  noticeMessage: "",
  deleteTargetId: null,
  setSearchKeyword: jest.fn(),
  setSelectedTag: jest.fn(),
  setNoticeMessage: jest.fn(),
  openDeleteModal: jest.fn(),
  closeDeleteModal: jest.fn(),
  deleteNotice: jest.fn(),
  ...override,
});

describe("NoticeManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("공지사항 목록과 등록 버튼을 렌더링한다", () => {
    (useAdminNoticeList as jest.Mock).mockReturnValue(createHookValue());

    render(<NoticeManageClient initialNotices={notices} />);

    expect(screen.getAllByText("공지사항 관리")[0]).toBeVisible();
    expect(screen.getByText("총 1건의 공지사항을 관리합니다.")).toBeVisible();
    expect(screen.getAllByText("서비스 점검 안내")[0]).toBeVisible();
    expect(screen.getByRole("link", { name: "공지사항 등록" })).toHaveAttribute(
      "href",
      "/csadmin/notice/new"
    );
  });

  test("검색어와 태그 필터를 변경하면 hook setter를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useAdminNoticeList as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeManageClient initialNotices={notices} />);

    await user.type(screen.getByPlaceholderText("제목, 내용, 번호 검색..."), "점검");
    await user.selectOptions(screen.getByLabelText("공지사항 태그 필터"), "MAINTENANCE");

    expect(hookValue.setSearchKeyword).toHaveBeenCalled();
    expect(hookValue.setSelectedTag).toHaveBeenCalledWith("MAINTENANCE");
  });

  test("삭제 버튼 클릭 시 삭제 모달을 연다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useAdminNoticeList as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeManageClient initialNotices={notices} />);

    await user.click(screen.getAllByLabelText("삭제: 공지사항 1")[0]);

    expect(hookValue.openDeleteModal).toHaveBeenCalledWith(1);
  });

  test("삭제 모달에서 확인하면 deleteNotice를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ deleteTargetId: 1 });
    (useAdminNoticeList as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeManageClient initialNotices={notices} />);

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(hookValue.deleteNotice).toHaveBeenCalled();
  });

  test("공지사항이 없으면 빈 상태 문구를 보여준다", () => {
    (useAdminNoticeList as jest.Mock).mockReturnValue(
      createHookValue({ filteredNotices: [], totalCount: 0 })
    );

    render(<NoticeManageClient initialNotices={[]} />);

    expect(screen.getAllByText("조건에 맞는 공지사항이 없습니다.")[0]).toBeVisible();
  });
});
