import ChatListPanel from "@/features/chat/components/ChatListPanel";
import type { ChatRoom } from "@/features/chat/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockRooms: ChatRoom[] = [
  {
    roomId: 1,
    type: "DIRECT",
    roomName: "김알고",
    profileImageUrl: null,
    lastMessage: "안녕하세요",
    lastMessageAt: "2026-06-29T12:00:00",
    unreadCount: 2,
  },
  {
    roomId: 2,
    type: "GROUP",
    roomName: "알고가 스터디방",
    profileImageUrl: null,
    lastMessage: "회의 시작합니다",
    lastMessageAt: "2026-06-29T13:00:00",
    unreadCount: 0,
    memberCount: 3,
  },
];

describe("ChatListPanel 컴포넌트 테스트", () => {
  test("채팅방 목록 제목이 정상적으로 렌더링된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText("메시지")).toBeInTheDocument();
  });

  test("채팅방 목록이 화면에 표시된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText("김알고")).toBeInTheDocument();
    expect(screen.getByText("안녕하세요")).toBeInTheDocument();
    expect(screen.getByText("알고가 스터디방")).toBeInTheDocument();
    expect(screen.getByText(/회의 시작합니다/)).toBeInTheDocument();
  });

  test("안 읽은 메시지 수가 있으면 뱃지가 표시된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("그룹 채팅방은 멤버 수가 표시된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText(/멤버 3명/)).toBeInTheDocument();
  });

  test("채팅방을 클릭하면 onSelectRoom이 호출된다", async () => {

    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    await user.click(screen.getByText("김알고"));
    expect(onSelectRoom).toHaveBeenCalledWith(mockRooms[0]);
  });

  test("닫기 버튼을 누르면 onClose가 호출된다", async () => {

    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    await user.click(screen.getByLabelText("채팅 닫기"));
    expect(onClose).toHaveBeenCalled();
  });

  test("새 채팅 메뉴에서 1대1 채팅 만들기를 누르면 onStartDirectChat이 호출된다", async () => {

    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    await user.click(screen.getByLabelText("새 채팅 메뉴 열기"));
    const directChatButton = screen.getByText("1:1 대화 시작").closest("button");
    expect(directChatButton).toBeInTheDocument();
    await user.click(directChatButton!);

    expect(onStartDirectChat).toHaveBeenCalled();
  });

  test("새 채팅 메뉴에서 그룹 채팅 만들기를 누르면 onStartGroupChat이 호출된다", async () => {

    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={mockRooms}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    await user.click(screen.getByLabelText("새 채팅 메뉴 열기"));
    await user.click(screen.getByText("그룹 채팅"));
    expect(onStartGroupChat).toHaveBeenCalled();
  });

  test("로딩 중이면 로딩 문구가 표시된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={[]}
        isLoading
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText("채팅방을 불러오는 중입니다...")).toBeInTheDocument();
  });

  test("에러가 있으면 에러 문구가 표시된다", () => {

    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();

    render(
      <ChatListPanel
        rooms={[]}
        errorMessage="채팅방 목록 조회 실패"
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByText("채팅방 목록 조회 실패")).toBeInTheDocument();
  });

  test("채팅방이 없으면 빈 목록 문구가 표시된다", () => {
    // Given
    const onClose = jest.fn();
    const onSelectRoom = jest.fn();
    const onStartDirectChat = jest.fn();
    const onStartGroupChat = jest.fn();
    const onLeaveRoom = jest.fn();
    render(
      <ChatListPanel
        rooms={[]}
        onClose={onClose}
        onSelectRoom={onSelectRoom}
        onStartDirectChat={onStartDirectChat}
        onStartGroupChat={onStartGroupChat}
        onLeaveRoom={onLeaveRoom}
      />
    );
    expect(screen.getByText("참여 중인 채팅방이 없습니다.")).toBeInTheDocument();
  });
});
