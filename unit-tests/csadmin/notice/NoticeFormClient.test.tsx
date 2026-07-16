import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoticeFormClient from "@/features/csadmin/notice/components/NoticeFormClient";
import { useNoticeForm } from "@/features/csadmin/notice/hooks/useNoticeForm";

jest.mock("@/features/csadmin/notice/hooks/useNoticeForm", () => ({
  useNoticeForm: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const createHookValue = (override = {}) => ({
  formData: {
    title: "",
    content: "",
    tag: "NOTICE",
  },
  tagOptions: [
    { value: "NOTICE", label: "공지" },
    { value: "EVENT", label: "이벤트" },
    { value: "MAINTENANCE", label: "점검" },
  ],
  isLoading: false,
  isSubmitting: false,
  error: "",
  confirmOpen: false,
  completeOpen: false,
  setConfirmOpen: jest.fn(),
  setCompleteOpen: jest.fn(),
  updateField: jest.fn(),
  saveNotice: jest.fn(),
  validateForm: jest.fn(() => true),
  ...override,
});

describe("NoticeFormClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("공지사항 등록 폼을 렌더링한다", () => {
    (useNoticeForm as jest.Mock).mockReturnValue(createHookValue());

    render(<NoticeFormClient mode="create" />);

    expect(screen.getAllByText("공지사항 등록")[0]).toBeVisible();
    expect(screen.getByLabelText(/제목/)).toBeVisible();
    expect(screen.getByLabelText(/내용/)).toBeVisible();
    expect(screen.getByRole("button", { name: "등록하기" })).toBeVisible();
  });

  test("제목, 내용, 태그 변경 시 updateField를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useNoticeForm as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeFormClient mode="create" />);

    await user.type(screen.getByLabelText(/제목/), "공지 제목");
    await user.type(screen.getByLabelText(/내용/), "공지 내용");
    await user.click(screen.getByRole("button", { name: "이벤트" }));

    expect(hookValue.updateField).toHaveBeenCalledWith("title", expect.any(String));
    expect(hookValue.updateField).toHaveBeenCalledWith("content", expect.any(String));
    expect(hookValue.updateField).toHaveBeenCalledWith("tag", "EVENT");
  });

  test("등록 버튼을 누르면 validateForm과 saveNotice를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({
      formData: {
        title: "공지 제목",
        content: "공지 내용",
        tag: "NOTICE",
      },
    });
    (useNoticeForm as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeFormClient mode="create" />);

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(hookValue.validateForm).toHaveBeenCalled();
    expect(hookValue.saveNotice).toHaveBeenCalled();
  });

  test("수정 버튼을 누르면 확인 모달을 연다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({
      formData: {
        title: "수정 제목",
        content: "수정 내용",
        tag: "NOTICE",
      },
    });
    (useNoticeForm as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeFormClient mode="edit" noticeId={1} />);

    await user.click(screen.getByRole("button", { name: "수정 완료" }));

    expect(hookValue.setConfirmOpen).toHaveBeenCalledWith(true);
  });

  test("완료 모달 확인 시 공지사항 목록으로 이동한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ completeOpen: true });
    (useNoticeForm as jest.Mock).mockReturnValue(hookValue);

    render(<NoticeFormClient mode="create" />);

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(hookValue.setCompleteOpen).toHaveBeenCalledWith(false);
    expect(pushMock).toHaveBeenCalledWith("/csadmin/notice");
  });
});
