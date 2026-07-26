import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FriendManagement from "@/features/friends/components/FriendManagement";
import {
  acceptFriendRequest,
  blockUser,
  deleteFriend,
  getBlockedUsers,
  getFriends,
  getReceivedFriendRequests,
  rejectFriendRequest,
  unblockUser,
} from "@/features/friends/friend.service";
import type { Friend } from "@/features/friends/friend.types";

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

jest.mock("@/features/friends/friend.service", () => ({
  getFriends: jest.fn(),
  getReceivedFriendRequests: jest.fn(),
  getBlockedUsers: jest.fn(),
  deleteFriend: jest.fn(),
  blockUser: jest.fn(),
  acceptFriendRequest: jest.fn(),
  rejectFriendRequest: jest.fn(),
  unblockUser: jest.fn(),
  toggleFriendFavorite: jest.fn(),
  searchUserByCode: jest.fn(),
  sendFriendRequest: jest.fn(),
}));

const makeFriend = (overrides: Partial<Friend>): Friend => ({
  relationId: 1,
  userId: 10,
  nickname: "김알고",
  personalCode: "ALGO01",
  profileImageUrl: null,
  isFavorite: false,
  isOnline: true,
  ...overrides,
});

describe("FriendManagement 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getFriends as jest.Mock).mockResolvedValue([
      makeFriend({ relationId: 1, nickname: "김알고", personalCode: "ALGO01" }),
    ]);
    (getReceivedFriendRequests as jest.Mock).mockResolvedValue([
      makeFriend({ relationId: 2, nickname: "박여행", personalCode: "TRIP02" }),
    ]);
    (getBlockedUsers as jest.Mock).mockResolvedValue([
      makeFriend({ relationId: 3, userId: 12, nickname: "이차단", personalCode: "BLOCK03" }),
    ]);
  });

  test("로딩 중에는 로딩 문구가 표시된다", async () => {
    render(<FriendManagement personalCode="MY01" />);

    expect(
      screen.getByText("친구 목록을 불러오는 중입니다...")
    ).toBeInTheDocument();

    // 로딩 이후 상태 업데이트가 테스트 종료 뒤로 새지 않도록 완료까지 기다린다
    await screen.findByText("김알고");
  });

  test("로딩이 끝나면 친구 목록과 탭 개수가 표시된다", async () => {
    render(<FriendManagement personalCode="MY01" />);

    expect(await screen.findByText("김알고")).toBeInTheDocument();
    expect(screen.getByText("받은 요청")).toBeInTheDocument();
    expect(screen.getByText("차단 목록")).toBeInTheDocument();
  });

  test("받은 요청 탭으로 전환하면 요청 목록이 표시된다", async () => {
    const user = userEvent.setup();
    render(<FriendManagement personalCode="MY01" />);

    await screen.findByText("김알고");
    await user.click(screen.getByText("받은 요청"));

    expect(screen.getByText("박여행")).toBeInTheDocument();
    expect(screen.getByText("수락")).toBeInTheDocument();
    expect(screen.getByText("거절")).toBeInTheDocument();
  });

  test("차단 목록 탭으로 전환하면 차단된 사용자가 표시된다", async () => {
    const user = userEvent.setup();
    render(<FriendManagement personalCode="MY01" />);

    await screen.findByText("김알고");
    await user.click(screen.getByText("차단 목록"));

    expect(screen.getByText("이차단")).toBeInTheDocument();
  });

  test("받은 요청 조회만 실패해도 친구와 차단 목록은 표시된다", async () => {
    const user = userEvent.setup();
    (getReceivedFriendRequests as jest.Mock).mockRejectedValue(
      new Error("받은 요청 API 실패")
    );

    render(<FriendManagement personalCode="MY01" />);

    expect(await screen.findByText("김알고")).toBeInTheDocument();
    expect(
      screen.queryByText("받은 요청 API 실패")
    ).not.toBeInTheDocument();

    await user.click(screen.getByText("받은 요청"));
    expect(
      screen.getByText("받은 친구 요청이 없습니다.")
    ).toBeInTheDocument();

    await user.click(screen.getByText("차단 목록"));
    expect(screen.getByText("이차단")).toBeInTheDocument();

    expect(getFriends).toHaveBeenCalledTimes(1);
    expect(getReceivedFriendRequests).toHaveBeenCalledTimes(1);
    expect(getBlockedUsers).toHaveBeenCalledTimes(1);
  });

  test("세 조회 API가 모두 실패하면 전체 오류를 표시한다", async () => {
    (getFriends as jest.Mock).mockRejectedValue(
      new Error("친구 목록 API 실패")
    );
    (getReceivedFriendRequests as jest.Mock).mockRejectedValue(
      new Error("받은 요청 API 실패")
    );
    (getBlockedUsers as jest.Mock).mockRejectedValue(
      new Error("차단 목록 API 실패")
    );

    render(<FriendManagement personalCode="MY01" />);

    expect(
      await screen.findByText("친구 목록 API 실패")
    ).toBeInTheDocument();
    expect(screen.queryByText("김알고")).not.toBeInTheDocument();
  });

  test("친구를 삭제하면 목록과 개수가 즉시 갱신된다", async () => {
    const user = userEvent.setup();
    (deleteFriend as jest.Mock).mockResolvedValue(undefined);

    render(<FriendManagement personalCode="MY01" />);
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("김알고 친구 메뉴 열기"));
    await user.click(screen.getByText("삭제하기"));
    const deleteButtons = await screen.findAllByRole("button", {
      name: "삭제하기",
    });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() =>
      expect(screen.queryByText("김알고")).not.toBeInTheDocument()
    );
    expect(deleteFriend).toHaveBeenCalledWith(1);
  });

  test("친구를 차단하면 재조회 없이 차단 목록에 바로 반영된다", async () => {
    const user = userEvent.setup();
    (blockUser as jest.Mock).mockResolvedValue(undefined);

    render(<FriendManagement personalCode="MY01" />);
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("김알고 친구 메뉴 열기"));
    await user.click(screen.getByText("차단하기"));
    const blockButtons = await screen.findAllByRole("button", {
      name: "차단하기",
    });
    await user.click(blockButtons[blockButtons.length - 1]);

    await waitFor(() =>
      expect(screen.queryByText("김알고")).not.toBeInTheDocument()
    );
    expect(blockUser).toHaveBeenCalledWith("ALGO01");
    // 차단 후 목록은 로컬로 갱신되고 서버 재조회는 마운트 시 1번만 일어난다
    expect(getBlockedUsers).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText("차단 목록"));
    expect(screen.getByText("김알고")).toBeInTheDocument();
  });

  test("친구 요청을 수락하면 재조회 없이 친구 목록으로 이동한다", async () => {
    const user = userEvent.setup();
    (acceptFriendRequest as jest.Mock).mockResolvedValue(undefined);

    render(<FriendManagement personalCode="MY01" />);
    await screen.findByText("김알고");

    await user.click(screen.getByText("받은 요청"));
    await screen.findByText("박여행");
    await user.click(screen.getByText("수락"));

    await waitFor(() =>
      expect(screen.queryByText("박여행")).not.toBeInTheDocument()
    );
    expect(acceptFriendRequest).toHaveBeenCalledWith(2);
    // 수락 후 친구 목록은 요청 데이터를 재사용하고 서버 재조회는 마운트 시 1번만 일어난다
    expect(getFriends).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /친구 목록/ }));
    expect(screen.getByText("박여행")).toBeInTheDocument();
  });

  test("친구 요청을 거절하면 목록에서 사라진다", async () => {
    const user = userEvent.setup();
    (rejectFriendRequest as jest.Mock).mockResolvedValue(undefined);

    render(<FriendManagement personalCode="MY01" />);
    await screen.findByText("김알고");

    await user.click(screen.getByText("받은 요청"));
    await screen.findByText("박여행");
    await user.click(screen.getByText("거절"));

    await waitFor(() =>
      expect(screen.queryByText("박여행")).not.toBeInTheDocument()
    );
    expect(rejectFriendRequest).toHaveBeenCalledWith(2);
  });

  test("차단을 해제하면 차단 목록에서만 제거되고 친구 목록은 재조회되지 않는다", async () => {
    const user = userEvent.setup();
    (unblockUser as jest.Mock).mockResolvedValue(undefined);

    render(<FriendManagement personalCode="MY01" />);
    await screen.findByText("김알고");

    await user.click(screen.getByText("차단 목록"));
    await screen.findByText("이차단");
    await user.click(screen.getByText("차단 해제"));

    const confirmButtons = await screen.findAllByRole("button", {
      name: "차단 해제",
    });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() =>
      expect(screen.queryByText("이차단")).not.toBeInTheDocument()
    );
    expect(unblockUser).toHaveBeenCalledWith("BLOCK03");
    // 차단 해제는 친구 목록과 무관하므로 마운트 시 1번 외에는 재조회하지 않는다
    expect(getFriends).toHaveBeenCalledTimes(1);
  });
});
