import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ManagerFormClient from "@/features/superadmin/manager/components/ManagerFormClient";
import {
  createAdminManager,
  getAdminManagerById,
  updateAdminManager,
} from "@/features/services/adminManager.service";

jest.mock("@/features/services/adminManager.service", () => ({
  createAdminManager: jest.fn(),
  getAdminManagerById: jest.fn(),
  updateAdminManager: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/features/common/components/CompleteModal", () => {
  return function CompleteModalMock({
    open,
    title,
    description,
    buttonText,
    onConfirm,
  }: {
    open: boolean;
    title: string;
    description: string;
    buttonText: string;
    onConfirm: () => void;
  }) {
    if (!open) return null;

    return (
      <section role="dialog" aria-label={title}>
        <p>{description}</p>
        <button type="button" onClick={onConfirm}>
          {buttonText}
        </button>
      </section>
    );
  };
});

jest.mock("@/features/common/components/Modal", () => {
  return function ModalMock({
    open,
    title,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    title: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) {
    if (!open) return null;

    return (
      <section role="dialog" aria-label={title}>
        <button type="button" onClick={onCancel}>
          {cancelText}
        </button>
        <button type="button" onClick={onConfirm}>
          {confirmText}
        </button>
      </section>
    );
  };
});

describe("슈퍼어드민 관리자 계정 폼 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createAdminManager as jest.Mock).mockResolvedValue(null);
    (updateAdminManager as jest.Mock).mockResolvedValue(null);
  });

  test("관리자 생성 폼에서 슈퍼 관리자 권한은 선택할 수 없다", () => {
    render(<ManagerFormClient mode="create" />);

    expect(screen.getByText("관리자 계정 생성")).toBeVisible();
    expect(screen.getByLabelText("로그인 ID *")).toBeVisible();
    expect(screen.getByText("CS 매니저")).toBeVisible();
    expect(screen.queryByText("슈퍼 관리자")).not.toBeInTheDocument();
  });

  test("필수 값을 입력하지 않고 제출하면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<ManagerFormClient mode="create" />);

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(screen.getByText("로그인 ID를 입력해주세요.")).toBeVisible();
    expect(createAdminManager).not.toHaveBeenCalled();
  });

  test("관리자 생성 정보를 입력하면 createAdminManager가 호출된다", async () => {
    const user = userEvent.setup();

    render(<ManagerFormClient mode="create" />);

    await user.type(screen.getByLabelText("로그인 ID *"), "csmanager01");
    await user.type(screen.getByLabelText("비밀번호 *"), "password123");
    await user.type(screen.getByLabelText("이름 *"), "CS관리자");
    await user.type(screen.getByLabelText("전화번호 *"), "01012345678");
    await user.type(screen.getByLabelText("이메일 *"), "cs@algoga.kr");
    await user.click(screen.getByText("CS 매니저"));
    await user.click(screen.getByRole("button", { name: "등록하기" }));

    await waitFor(() => {
      expect(createAdminManager).toHaveBeenCalledWith({
        loginId: "csmanager01",
        password: "password123",
        name: "CS관리자",
        phone: "010-1234-5678",
        email: "cs@algoga.kr",
        role: "CS_MANAGER",
      });
    });

    expect(await screen.findByRole("dialog", { name: "등록 완료" })).toBeVisible();
  });

  test("관리자 수정 폼은 기존 관리자 정보를 초기값으로 표시한다", async () => {
    (getAdminManagerById as jest.Mock).mockResolvedValue({
      managerId: 2,
      displayId: "A002",
      loginId: "stats01",
      name: "통계관리자",
      phone: "010-2222-3333",
      email: "stats@algoga.kr",
      role: "STATISTICS_MANAGER",
      roleLabel: "통계 매니저",
      createdAt: "2026.07.20",
      active: true,
    });

    render(<ManagerFormClient mode="edit" managerId={2} />);

    expect(await screen.findByDisplayValue("stats01")).toBeVisible();
    expect(screen.getByDisplayValue("통계관리자")).toBeVisible();
    expect(screen.getByDisplayValue("010-2222-3333")).toBeVisible();
    expect(screen.getByDisplayValue("stats@algoga.kr")).toBeVisible();
    expect(screen.getByText("슈퍼 관리자")).toBeVisible();
  });

  test("관리자 수정 제출 시 확인 후 updateAdminManager가 호출된다", async () => {
    const user = userEvent.setup();

    (getAdminManagerById as jest.Mock).mockResolvedValue({
      managerId: 2,
      displayId: "A002",
      loginId: "stats01",
      name: "통계관리자",
      phone: "010-2222-3333",
      email: "stats@algoga.kr",
      role: "STATISTICS_MANAGER",
      roleLabel: "통계 매니저",
      createdAt: "2026.07.20",
      active: true,
    });

    render(<ManagerFormClient mode="edit" managerId={2} />);

    await screen.findByDisplayValue("stats01");
    await user.clear(screen.getByLabelText("이름 *"));
    await user.type(screen.getByLabelText("이름 *"), "수정관리자");
    await user.click(screen.getByRole("button", { name: "수정 완료" }));
    await user.click(await screen.findByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(updateAdminManager).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          loginId: "stats01",
          name: "수정관리자",
          phone: "010-2222-3333",
          email: "stats@algoga.kr",
          role: "STATISTICS_MANAGER",
        })
      );
    });
  });
});
