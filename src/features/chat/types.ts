export type ChatRoomType = "DIRECT" | "GROUP";

export interface ChatRoom {
  roomId: number;
  type: ChatRoomType;
  roomName: string | null;
  profileImageUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount?: number;
  memberCount?: number;
  isMine?: boolean;
}

export interface ChatMessage {
  messageId: number;
  roomId: number;
  senderId?: number;
  senderNickname: string;
  senderProfileImageUrl: string | null;
  content: string;
  createdAt: string;
  unreadCount?: number;
  isMine?: boolean;
  isSystem?: boolean;
}

export interface Friend {
  friendId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ChatRoomMember {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ReadEvent {
  roomId: number;
  readerId?: number;
  messageId?: number;
  unreadCount?: number;
}

export interface TypingEvent {
  userId: number;
  nickname: string;
  isTyping: boolean;
}

export interface RoomNotification {
  roomId: number;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export type ChatPanelView = "list" | "room" | "direct-create" | "group-create";


