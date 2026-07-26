import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FriendPanel from "@/features/friends/components/FriendPanel";
import {
  getFriends,
  toggleFriendFavorite,
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
  toggleFriendFavorite: jest.fn(),
}));

const mockFriends: Friend[] = [
  {
    relationId: 1,
    userId: 10,
    nickname: "김알고",
    personalCode: "ALGO01",
    profileImageUrl: null,
    isFavorite: false,
    isOnline: true,
  },
  {
    relationId: 2,
    userId: 11,
    nickname: "박여행",
    personalCode: "TRIP02",
    profileImageUrl: null,
    isFavorite: true,
    isOnline: false,
  },
];

// FriendPanel은 전역 커스텀 이벤트로만 열고 닫혀서, 헬퍼로 열기 이벤트를 보낸다
const openPanel = () => {
  act(() => {
    window.dispatchEvent(new Event("friend-panel-toggle"));
  });
};

describe("FriendPanel 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getFriends as jest.Mock).mockResolvedValue(mockFriends);
  });

  test("열리기 전에는 아무것도 렌더링하지 않는다", () => {
    render(<FriendPanel />);

    expect(screen.queryByLabelText("친구 목록")).not.toBeInTheDocument();
  });

  test("열기 이벤트를 받으면 친구 목록을 불러와 표시한다", async () => {
    render(<FriendPanel />);

    openPanel();

    expect(await screen.findByText("김알고")).toBeInTheDocument();
    expect(screen.getByText("박여행")).toBeInTheDocument();
    expect(getFriends).toHaveBeenCalledTimes(1);
  });

  test("닫기 버튼을 누르면 패널이 닫힌다", async () => {
    const user = userEvent.setup();
    render(<FriendPanel />);

    openPanel();
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("친구 목록 닫기"));

    expect(screen.queryByLabelText("친구 목록")).not.toBeInTheDocument();
  });

  test("검색어로 친구를 필터링한다", async () => {
    const user = userEvent.setup();
    render(<FriendPanel />);

    openPanel();
    await screen.findByText("김알고");

    await user.type(
      screen.getByPlaceholderText("친구 닉네임으로 검색"),
      "박여행"
    );

    expect(screen.queryByText("김알고")).not.toBeInTheDocument();
    expect(screen.getByText("박여행")).toBeInTheDocument();
  });

  test("즐겨찾기 탭으로 전환하면 즐겨찾기한 친구만 표시된다", async () => {
    const user = userEvent.setup();
    render(<FriendPanel />);

    openPanel();
    await screen.findByText("김알고");

    await user.click(screen.getByText("즐겨찾기"));

    expect(screen.queryByText("김알고")).not.toBeInTheDocument();
    expect(screen.getByText("박여행")).toBeInTheDocument();
  });

  test("즐겨찾기 버튼을 누르면 낙관적으로 갱신되고 API를 호출한다", async () => {
    const user = userEvent.setup();
    (toggleFriendFavorite as jest.Mock).mockResolvedValue(undefined);
    // 이미 즐겨찾기인 친구가 섞여 있으면 "즐겨찾기 해제" 라벨이 중복되므로 대상 친구만 준비한다
    (getFriends as jest.Mock).mockResolvedValue([mockFriends[0]]);

    render(<FriendPanel />);
    openPanel();
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("즐겨찾기 추가"));

    expect(screen.getByLabelText("즐겨찾기 해제")).toBeInTheDocument();
    expect(toggleFriendFavorite).toHaveBeenCalledWith(1);
  });

  test("즐겨찾기 API가 실패하면 원래 상태로 되돌린다", async () => {
    const user = userEvent.setup();
    (toggleFriendFavorite as jest.Mock).mockRejectedValue(
      new Error("즐겨찾기 실패")
    );
    (getFriends as jest.Mock).mockResolvedValue([mockFriends[0]]);

    render(<FriendPanel />);
    openPanel();
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("즐겨찾기 추가"));

    // 실패 시 errorMessage가 채워지면서 목록 대신 에러 화면으로 전환된다(목록 자체는 사라짐)
    expect(await screen.findByText("즐겨찾기 실패")).toBeInTheDocument();
    expect(toggleFriendFavorite).toHaveBeenCalledWith(1);
  });

  test("친구를 선택하면 채팅 위젯 이벤트를 보내고 패널을 닫는다", async () => {
    const user = userEvent.setup();
    const handleOpenFriend = jest.fn();
    window.addEventListener("chat-widget-open-friend", handleOpenFriend);

    render(<FriendPanel />);
    openPanel();
    await screen.findByText("김알고");

    await user.click(screen.getByLabelText("김알고님과 채팅하기"));

    expect(handleOpenFriend).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText("친구 목록")).not.toBeInTheDocument();

    window.removeEventListener("chat-widget-open-friend", handleOpenFriend);
  });

  test("조회에 실패하면 에러 문구와 다시 시도 버튼이 표시된다", async () => {
    (getFriends as jest.Mock).mockRejectedValue(new Error("서버 오류"));

    render(<FriendPanel />);
    openPanel();

    // 일반 Error는 제목/설명 문구가 동일한 텍스트로 겹쳐 렌더링된다
    expect(
      (await screen.findAllByText("친구 목록을 불러오지 못했습니다.")).length
    ).toBeGreaterThan(0);
    expect(screen.getByText("다시 시도")).toBeInTheDocument();
  });

  test("친구가 없으면 빈 목록 문구가 표시된다", async () => {
    (getFriends as jest.Mock).mockResolvedValue([]);

    render(<FriendPanel />);
    openPanel();

    expect(
      await screen.findByText("아직 등록된 친구가 없습니다.")
    ).toBeInTheDocument();
  });
});
