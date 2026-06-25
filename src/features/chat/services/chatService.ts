import { api, type ApiResult, unwrapData } from "@/lib/api";
import type { ChatMessage, ChatRoom, ChatRoomType, Friend } from "../types/chat";

type RawRecord = Record<string, unknown>;

const asRecord = (value: unknown): RawRecord => {
  return value && typeof value === "object" ? (value as RawRecord) : {};
};

const getNumber = (record: RawRecord, keys: string[], fallback = 0) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null && item !== "");
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getString = (record: RawRecord, keys: string[], fallback = "") => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null && item !== "");

  return typeof value === "string" ? value : fallback;
};

const getBoolean = (record: RawRecord, keys: string[], fallback = false) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null);

  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";

  return fallback;
};
const getNullableString = (record: RawRecord, keys: string[]) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null);

  return typeof value === "string" && value.trim() ? value : null;
};

const getItems = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  const record = asRecord(data);
  const content = record.content;
  const items = record.items;
  const rooms = record.rooms;
  const messages = record.messages;
  const friends = record.friends;

  if (Array.isArray(content)) return content as T[];
  if (Array.isArray(items)) return items as T[];
  if (Array.isArray(rooms)) return rooms as T[];
  if (Array.isArray(messages)) return messages as T[];
  if (Array.isArray(friends)) return friends as T[];

  return [];
};

const normalizeRoomType = (value: unknown): ChatRoomType => {
  return value === "GROUP" ? "GROUP" : "DIRECT";
};

const normalizeChatRoom = (item: unknown): ChatRoom => {
  const record = asRecord(item);
  const type = normalizeRoomType(record.type ?? record.roomType);
  const roomId = getNumber(record, ["roomId", "chatRoomId", "id"]);
  const fallbackName = type === "GROUP" ? "그룹 채팅" : "알 수 없는 상대";

  return {
    roomId,
    type,
    roomName: getNullableString(record, ["roomName", "name", "title"]) ?? fallbackName,
    profileImageUrl: getNullableString(record, ["profileImageUrl", "thumbnailUrl", "imageUrl"]),
    lastMessage: getNullableString(record, ["lastMessage", "latestMessage", "message"]),
    lastMessageAt: getNullableString(record, ["lastMessageAt", "latestMessageAt", "updatedAt", "createdAt"]),
    unreadCount: getNumber(record, ["unreadCount", "unreadMessageCount"], 0),
  };
};

export const normalizeChatMessage = (item: unknown): ChatMessage => {
  const record = asRecord(item);
  const senderId = getNumber(record, ["senderId", "userId"], -1);

  return {
    messageId: getNumber(record, ["messageId", "chatMessageId", "id"], Date.now()),
    roomId: getNumber(record, ["roomId", "chatRoomId"]),
    senderId: senderId >= 0 ? senderId : undefined,
    senderNickname: getString(record, ["senderNickname", "nickname", "senderName", "name"], "알 수 없음"),
    senderProfileImageUrl: getNullableString(record, ["senderProfileImageUrl", "profileImageUrl"]),
    content: getString(record, ["content", "message", "text"], ""),
    createdAt: getString(record, ["createdAt", "sentAt", "timestamp"], ""),
    unreadCount: getNumber(record, ["unreadCount"], 0),
    isMine: getBoolean(record, ["isMine", "mine", "myMessage", "sentByMe", "fromMe"]),
    isSystem: senderId === 0,
  };
};

const normalizeFriend = (item: unknown): Friend => {
  const record = asRecord(item);

  return {
    friendId: getNumber(record, ["targetUserId", "friendUserId", "friendId", "userId", "id"]),
    nickname: getString(record, ["nickname", "friendNickname", "name"], "알 수 없는 친구"),
    profileImageUrl: getNullableString(record, ["profileImageUrl", "friendProfileImageUrl", "imageUrl"]),
  };
};

export const getChatRooms = async (signal?: AbortSignal): Promise<ChatRoom[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/chat/rooms", {
    params: { t: Date.now() },
    signal,
    suppressGlobalError: true,
  });

  return getItems(unwrapData(response)).map(normalizeChatRoom).filter((room) => room.roomId > 0);
};

export const getChatMessages = async (roomId: number, signal?: AbortSignal): Promise<ChatMessage[]> => {
  const response = await api.get<ApiResult<unknown>>(`/api/v1/chat/rooms/${roomId}/messages`, {
    signal,
    suppressGlobalError: true,
  });

  return getItems(unwrapData(response))
    .map(normalizeChatMessage)
    .filter((message) => message.messageId > 0)
    .reverse();
};

export const leaveChatRoom = async (roomId: number) => {
  // console.log("leaveChatRoom service 진입", roomId);
  await api.delete<ApiResult<null>>(`/api/v1/chat/rooms/${roomId}/leave`, {
    suppressGlobalError: true,
  });
  // console.log("leaveChatRoom DELETE 성공", roomId);
};

export const getFriends = async (signal?: AbortSignal): Promise<Friend[]> => {
  const response = await api.get<ApiResult<unknown>>("/api/v1/friends", {
    signal,
    suppressGlobalError: true,
  });

  return getItems(unwrapData(response)).map(normalizeFriend).filter((friend) => friend.friendId > 0);
};

export const createDirectChatRoom = async (targetUserId: number): Promise<ChatRoom> => {
  const response = await api.post<ApiResult<unknown>>("/api/v1/chat/rooms", { targetUserId }, {
    suppressGlobalError: true,
  });

  return normalizeChatRoom(unwrapData(response));
};

export const createGroupChatRoom = async (roomName: string, targetUserIds: number[]): Promise<ChatRoom> => {
  const response = await api.post<ApiResult<unknown>>("/api/v1/chat/rooms/group", { roomName, targetUserIds }, {
    suppressGlobalError: true,
  });

  return normalizeChatRoom(unwrapData(response));
};






