import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlacklistDetailClient from "@/features/superadmin/blacklist/components/BlacklistDetailClient";
import {
  deregisterBlacklistUser,
  getBlacklistCandidateById,
  getReportedUserReports,
  registerBlacklistUser,
} from "@/features/services/adminBlacklist.service";

jest.mock("@/features/services/adminBlacklist.service", () => ({
  deregisterBlacklistUser: jest.fn(),
  getBlacklistCandidateById: jest.fn(),
  getReportedUserReports: jest.fn(),
  registerBlacklistUser: jest.fn(),
}));

const backMock = jest.fn();
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: backMock,
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

const userDetail = {
  userId: 105,
  displayId: "U0105",
  username: "baduser123",
  name: "홍길동",
  nickname: "악플러",
  email: "baduser@example.com",
  reportCount: 7,
  lastReportedAt: "2026.07.10",
  isBlacklisted: false,
  registeredAt: "-",
  managerName: "-",
  status: "NORMAL" as const,
  phone: "010-1111-2222",
  joinedAt: "2026.07.01",
};

const reportPage = {
  items: [
    {
      reportId: 10,
      displayId: "R0010",
      targetType: "POST" as const,
      reasonType: "FALSE_INFO",
      createdAt: "2026.07.09",
      status: "RECEIVED" as const,
    },
  ],
  page: 1,
  size: 5,
  totalElements: 1,
  totalPages: 1,
};

describe("슈퍼어드민 블랙리스트 상세 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getBlacklistCandidateById as jest.Mock).mockResolvedValue(userDetail);
    (getReportedUserReports as jest.Mock).mockResolvedValue(reportPage);
    (registerBlacklistUser as jest.Mock).mockResolvedValue(undefined);
    (deregisterBlacklistUser as jest.Mock).mockResolvedValue(undefined);
  });

  test("유저 상세 정보와 신고 이력이 한국어로 렌더링된다", async () => {
    render(<BlacklistDetailClient userId={105} />);

    expect(await screen.findByText("baduser123")).toBeVisible();
    expect(screen.getByText("홍길동")).toBeVisible();
    expect(screen.getByText("악플러")).toBeVisible();
    expect(screen.getByText("baduser@example.com")).toBeVisible();
    expect(screen.getByText("7회")).toBeVisible();
    expect(screen.getByText("게시글")).toBeVisible();
    expect(screen.getByText("허위정보")).toBeVisible();
  });

  test("등록 사유 없이 블랙리스트 등록을 시도하면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(<BlacklistDetailClient userId={105} />);

    await screen.findByText("baduser123");
    await user.click(screen.getByRole("button", { name: /블랙리스트 등록/ }));
    await user.click(screen.getByRole("button", { name: "등록" }));

    expect(screen.getByText("등록 사유를 입력해주세요.")).toBeVisible();
    expect(registerBlacklistUser).not.toHaveBeenCalled();
  });

  test("등록 사유를 입력하면 블랙리스트 등록 API를 호출한다", async () => {
    const user = userEvent.setup();

    render(<BlacklistDetailClient userId={105} />);

    await screen.findByText("baduser123");
    await user.click(screen.getByRole("button", { name: /블랙리스트 등록/ }));
    await user.type(
      screen.getByPlaceholderText("블랙리스트 등록 사유를 입력해주세요."),
      "반복적인 허위정보 신고 누적"
    );
    await user.click(screen.getByRole("button", { name: "등록" }));

    await waitFor(() => {
      expect(registerBlacklistUser).toHaveBeenCalledWith(
        105,
        "반복적인 허위정보 신고 누적"
      );
    });

    expect(await screen.findByText("블랙리스트 등록이 완료되었습니다.")).toBeVisible();
  });

  test("이미 블랙리스트 유저이면 해제 버튼이 보이고 해제 API를 호출한다", async () => {
    const user = userEvent.setup();

    (getBlacklistCandidateById as jest.Mock).mockResolvedValue({
      ...userDetail,
      isBlacklisted: true,
      status: "BLACKLISTED",
    });

    render(<BlacklistDetailClient userId={105} />);

    await screen.findByText("baduser123");
    await user.click(screen.getByRole("button", { name: "블랙리스트 해제" }));
    await user.click(await screen.findByRole("button", { name: "해제" }));

    await waitFor(() => {
      expect(deregisterBlacklistUser).toHaveBeenCalledWith(105);
    });

    expect(await screen.findByText("블랙리스트 해제가 완료되었습니다.")).toBeVisible();
  });
});
