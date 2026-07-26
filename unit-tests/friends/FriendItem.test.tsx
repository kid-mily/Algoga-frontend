import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FriendItem from "@/features/friends/components/FriendItem";
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

const baseFriend: Friend = {
  relationId: 1,
  userId: 10,
  nickname: "김알고",
  personalCode: "ALGO01",
  profileImageUrl: null,
  isFavorite: false,
  isOnline: true,
};

describe("FriendItem 컴포넌트 테스트", () => {
  test("친구 닉네임과 개인 코드를 렌더링한다", () => {
    render(
      <FriendItem
        friend={baseFriend}
        onToggleFavorite={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText("김알고")).toBeInTheDocument();
    expect(screen.getByText("@ALGO01")).toBeInTheDocument();
  });

  test("온라인 상태면 온라인 배지가 표시된다", () => {
    render(
      <FriendItem
        friend={baseFriend}
        onToggleFavorite={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText("온라인")).toBeInTheDocument();
  });

  test("오프라인 상태면 오프라인 배지가 표시된다", () => {
    render(
      <FriendItem
        friend={{ ...baseFriend, isOnline: false }}
        onToggleFavorite={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText("오프라인")).toBeInTheDocument();
  });

  test("즐겨찾기 버튼을 누르면 relationId와 함께 onToggleFavorite이 호출된다", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = jest.fn();

    render(
      <FriendItem
        friend={baseFriend}
        onToggleFavorite={onToggleFavorite}
        onSelect={jest.fn()}
      />
    );

    await user.click(screen.getByLabelText("즐겨찾기 추가"));
    expect(onToggleFavorite).toHaveBeenCalledWith(1);
  });

  test("즐겨찾기 상태면 버튼 라벨이 해제로 바뀐다", () => {
    render(
      <FriendItem
        friend={{ ...baseFriend, isFavorite: true }}
        onToggleFavorite={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByLabelText("즐겨찾기 해제")).toBeInTheDocument();
  });

  test("채팅 버튼을 누르면 친구 정보와 함께 onSelect가 호출된다", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(
      <FriendItem
        friend={baseFriend}
        onToggleFavorite={jest.fn()}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByLabelText("김알고님과 채팅하기"));
    expect(onSelect).toHaveBeenCalledWith(baseFriend);
  });
});
