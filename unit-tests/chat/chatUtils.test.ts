import {
  getTotalUnreadCount,
  isBlankMessage,
  isMyMessage,
  isValidChatMessage,
  sortRoomsByRecentMessage,
} from "@/features/chat/utils";
import type { ChatMessage, ChatRoom } from "@/features/chat/types";

const createRoom = (room: Partial<ChatRoom>): ChatRoom => ({
  roomId: room.roomId ?? 1,
  type: room.type ?? "DIRECT",
  roomName: room.roomName ?? "테스트 채팅방",
  profileImageUrl: room.profileImageUrl ?? null,
  lastMessage: room.lastMessage ?? null,
  lastMessageAt: room.lastMessageAt ?? null,
  unreadCount: room.unreadCount,
  memberCount: room.memberCount,
});

const createMessage = (message: Partial<ChatMessage>): ChatMessage => ({
  messageId: message.messageId ?? 1,
  roomId: message.roomId ?? 1,
  senderId: message.senderId,
  senderNickname: message.senderNickname ?? "김알고",
  senderProfileImageUrl: message.senderProfileImageUrl ?? null,
  content: message.content ?? "안녕하세요",
  createdAt: message.createdAt ?? "2026-06-29T10:00:00",
  unreadCount: message.unreadCount,
});

describe("채팅 유틸 함수 단위 테스트", () => {
  test("공백 메시지는 빈 메시지로 판단한다", () => {
    expect(isBlankMessage("   ")).toBeTruthy();
  });

  test("내용이 있는 메시지는 빈 메시지가 아니다", () => {
    expect(isBlankMessage("안녕하세요")).toBeFalsy();
  });

  test("내용이 있고 300자 이하인 메시지는 유효하다", () => {
    expect(isValidChatMessage("안녕하세요")).toBeTruthy();
    expect(isValidChatMessage("a".repeat(300))).toBeTruthy();
  });

  test("공백 메시지와 301자 메시지는 유효하지 않다", () => {
    expect(isValidChatMessage("   ")).toBeFalsy();
    expect(isValidChatMessage("a".repeat(301))).toBeFalsy();
  });

  test("채팅방 안 읽은 메시지 수 합계를 계산한다", () => {
    const rooms: ChatRoom[] = [
      createRoom({ roomId: 1, unreadCount: 2 }),
      createRoom({ roomId: 2, unreadCount: 3 }),
      createRoom({ roomId: 3 }),
    ];

    expect(getTotalUnreadCount(rooms)).toBe(5);
  });

  test("내가 보낸 메시지인지 판단한다", () => {
    const message = createMessage({ senderId: 10 });

    expect(isMyMessage(message, 10)).toBeTruthy();
  });

  test("다른 사람이 보낸 메시지는 내 메시지가 아니다", () => {
    const message = createMessage({ senderId: 20 });

    expect(isMyMessage(message, 10)).toBeFalsy();
  });

  test("현재 사용자 ID가 없으면 내 메시지가 아니다", () => {
    const message = createMessage({ senderId: 10 });

    expect(isMyMessage(message)).toBeFalsy();
  });

  test("최근 메시지 시간이 최신인 채팅방이 먼저 온다", () => {
    const rooms: ChatRoom[] = [
      createRoom({
        roomId: 1,
        roomName: "오래된 방",
        lastMessageAt: "2026-06-29T10:00:00",
      }),
      createRoom({
        roomId: 2,
        roomName: "최신 방",
        lastMessageAt: "2026-06-29T12:00:00",
      }),
    ];

    const sortedRooms = sortRoomsByRecentMessage(rooms);

    expect(sortedRooms[0].roomName).toBe("최신 방");
    expect(sortedRooms[1].roomName).toBe("오래된 방");
  });

  test("메시지 시간이 없는 채팅방은 뒤로 정렬된다", () => {
    const rooms: ChatRoom[] = [
      createRoom({ roomId: 1, roomName: "시간 없는 방", lastMessageAt: null }),
      createRoom({
        roomId: 2,
        roomName: "시간 있는 방",
        lastMessageAt: "2026-06-29T12:00:00",
      }),
    ];

    const sortedRooms = sortRoomsByRecentMessage(rooms);

    expect(sortedRooms[0].roomName).toBe("시간 있는 방");
    expect(sortedRooms[1].roomName).toBe("시간 없는 방");
  });
});
