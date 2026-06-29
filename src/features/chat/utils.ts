import type { ChatMessage, ChatRoom } from "./types";

export const isBlankMessage = (message: string) => {
  return !message.trim();
};

export const isValidChatMessage = (message: string) => {
  const trimmedMessage = message.trim();

  return trimmedMessage.length > 0 && trimmedMessage.length <= 300;
};

export const getRoomSortTime = (room: ChatRoom) => {
  const value = room.lastMessageAt;
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const sortRoomsByRecentMessage = (rooms: ChatRoom[]) => {
  return [...rooms].sort((a, b) => getRoomSortTime(b) - getRoomSortTime(a));
};

export const getTotalUnreadCount = (rooms: ChatRoom[]) => {
  return rooms.reduce((total, room) => total + (room.unreadCount ?? 0), 0);
};

export const isMyMessage = (message: ChatMessage, currentUserId?: number) => {
  return Boolean(currentUserId && message.senderId === currentUserId);
};
