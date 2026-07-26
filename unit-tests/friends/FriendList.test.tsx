import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FriendList from "@/features/friends/components/FriendList";
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

describe("FriendList 컴포넌트 테스트", () => {
  test("친구 목록이 화면에 표시된다", () => {
    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={jest.fn()}
        onBlockFriend={jest.fn()}
      />
    );

    expect(screen.getByText("김알고")).toBeInTheDocument();
    expect(screen.getByText("@ALGO01")).toBeInTheDocument();
    expect(screen.getByText("박여행")).toBeInTheDocument();
    expect(screen.getByText("@TRIP02")).toBeInTheDocument();
  });

  test("친구가 없으면 빈 목록 문구가 표시된다", () => {
    render(
      <FriendList
        friends={[]}
        onDeleteFriend={jest.fn()}
        onBlockFriend={jest.fn()}
      />
    );

    expect(
      screen.getByText("아직 등록된 친구가 없습니다.")
    ).toBeInTheDocument();
  });

  test("검색어로 친구를 필터링한다", async () => {
    const user = userEvent.setup();

    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={jest.fn()}
        onBlockFriend={jest.fn()}
      />
    );

    await user.type(
      screen.getByPlaceholderText("친구 닉네임으로 검색"),
      "박여행"
    );

    expect(screen.queryByText("김알고")).not.toBeInTheDocument();
    expect(screen.getByText("박여행")).toBeInTheDocument();
  });

  test("검색 결과가 없으면 안내 문구가 표시된다", async () => {
    const user = userEvent.setup();

    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={jest.fn()}
        onBlockFriend={jest.fn()}
      />
    );

    await user.type(
      screen.getByPlaceholderText("친구 닉네임으로 검색"),
      "존재하지않는이름"
    );

    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  test("메뉴에서 삭제하기를 누르고 확인하면 onDeleteFriend가 호출된다", async () => {
    const user = userEvent.setup();
    const onDeleteFriend = jest.fn().mockResolvedValue(undefined);

    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={onDeleteFriend}
        onBlockFriend={jest.fn()}
      />
    );

    await user.click(screen.getByLabelText("김알고 친구 메뉴 열기"));
    await user.click(screen.getByText("삭제하기"));

    // 드롭다운 메뉴 항목과 모달 확인 버튼 둘 다 "삭제하기" 텍스트를 쓰므로
    // 모달이 나중에 렌더링된다는(문서 순서상 마지막) 점을 이용해 확인 버튼만 골라 클릭한다
    const deleteButtons = await screen.findAllByRole("button", {
      name: "삭제하기",
    });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    expect(onDeleteFriend).toHaveBeenCalledWith(mockFriends[0]);
  });

  test("메뉴에서 차단하기를 누르고 확인하면 onBlockFriend가 호출된다", async () => {
    const user = userEvent.setup();
    const onBlockFriend = jest.fn().mockResolvedValue(undefined);

    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={jest.fn()}
        onBlockFriend={onBlockFriend}
      />
    );

    await user.click(screen.getByLabelText("김알고 친구 메뉴 열기"));
    await user.click(screen.getByText("차단하기"));

    const blockButtons = await screen.findAllByRole("button", {
      name: "차단하기",
    });
    await user.click(blockButtons[blockButtons.length - 1]);

    expect(onBlockFriend).toHaveBeenCalledWith(mockFriends[0]);
  });

  test("취소를 누르면 onDeleteFriend/onBlockFriend가 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const onDeleteFriend = jest.fn();
    const onBlockFriend = jest.fn();

    render(
      <FriendList
        friends={mockFriends}
        onDeleteFriend={onDeleteFriend}
        onBlockFriend={onBlockFriend}
      />
    );

    await user.click(screen.getByLabelText("김알고 친구 메뉴 열기"));
    await user.click(screen.getByText("삭제하기"));
    await user.click(screen.getByText("취소"));

    expect(onDeleteFriend).not.toHaveBeenCalled();
    expect(onBlockFriend).not.toHaveBeenCalled();
  });
});
