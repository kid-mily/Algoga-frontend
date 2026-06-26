import { useCallback, useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { normalizeChatMessage } from "../services/chatService";
import type { ChatMessage, ReadEvent, TypingEvent } from "../types/chat";

type UseChatSocketOptions = {
  roomId?: number;
  userId?: number;
  onMessage?: (message: ChatMessage) => void;
  onRead?: (event: ReadEvent) => void;
  onTyping?: (event: TypingEvent) => void;
};

type SocketEnvelope = {
  data?: unknown;
};

type RawRecord = Record<string, unknown>;

const getNumber = (record: RawRecord, keys: string[], fallback = 0) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null && item !== "");
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getWebSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/chat";
  url.search = "";

  return url.toString();
};

const parseBody = (message: IMessage): unknown => {
  try {
    return JSON.parse(message.body) as unknown;
  } catch {
    return null;
  }
};

const unwrapBody = (body: unknown) => {
  if (body && typeof body === "object" && "data" in body) {
    return (body as SocketEnvelope).data;
  }

  return body;
};

const getNestedRecord = (record: RawRecord, keys: string[]) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null);

  return value && typeof value === "object" ? (value as RawRecord) : record;
};

const parseReadEvent = (body: unknown, fallbackRoomId?: number): ReadEvent | null => {
  const unwrappedBody = unwrapBody(body);
  if (!unwrappedBody || typeof unwrappedBody !== "object") return null;

  const record = getNestedRecord(unwrappedBody as RawRecord, [
    "read",
    "readEvent",
    "payload",
    "message",
    "body",
  ]);
  const roomId = getNumber(record, ["roomId", "chatRoomId", "id"], fallbackRoomId ?? 0);
  const readerId = getNumber(record, [
    "readerId",
    "userId",
    "memberId",
    "readerUserId",
    "readUserId",
    "readByUserId",
    "readMemberId",
  ]);
  const messageId = getNumber(record, ["messageId", "chatMessageId"]);
  const unreadCount = getNumber(record, ["unreadCount", "remainingUnreadCount"], -1);

  if (roomId <= 0 || (readerId <= 0 && messageId <= 0)) return null;

  return {
    roomId,
    readerId: readerId > 0 ? readerId : undefined,
    messageId: messageId > 0 ? messageId : undefined,
    unreadCount: unreadCount >= 0 ? unreadCount : undefined,
  };
};

const parseTypingEvent = (body: unknown): TypingEvent | null => {
  const unwrappedBody = unwrapBody(body);
  if (!unwrappedBody || typeof unwrappedBody !== "object") return null;

  const record = getNestedRecord(unwrappedBody as RawRecord, [
    "typing",
    "typingEvent",
    "payload",
    "message",
    "body",
  ]);
  const userId = getNumber(record, ["userId", "senderId", "memberId"]);
  const nicknameValue = record.nickname ?? record.senderNickname ?? record.name;
  const isTypingValue = record.isTyping ?? record.typing;

  if (userId <= 0 || typeof nicknameValue !== "string") return null;

  return {
    userId,
    nickname: nicknameValue,
    isTyping: Boolean(isTypingValue),
  };
};

export const useChatSocket = ({
  roomId,
  userId,
  onMessage,
  onRead,
  onTyping,
}: UseChatSocketOptions) => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendRead = useCallback(() => {
    const client = clientRef.current;
    if (!roomId || !client?.connected) return;

    client.publish({
      destination: `/app/chat/rooms/${roomId}/read`,
      body: "",
    });
  }, [roomId]);

  const sendMessage = useCallback(
    (content: string) => {
      const client = clientRef.current;
      const nextContent = content.trim();

      if (!roomId || !client?.connected || !nextContent) return false;

      client.publish({
        destination: `/app/chat/rooms/${roomId}/send`,
        body: JSON.stringify({ content: nextContent }),
      });

      return true;
    },
    [roomId]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const client = clientRef.current;

      if (!roomId || !client?.connected) return;

      client.publish({
        destination: `/app/chat/rooms/${roomId}/typing`,
        body: JSON.stringify({ isTyping }),
      });
    },
    [roomId]
  );

  useEffect(() => {
    if (!roomId) return;

    const client = new Client({
      brokerURL: getWebSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe(`/topic/chat/rooms/${roomId}`, (message) => {
          const rawMessage = unwrapBody(parseBody(message));
          if (!rawMessage || typeof rawMessage !== "object") return;

          const parsedMessage = normalizeChatMessage({
            roomId,
            ...(rawMessage as Record<string, unknown>),
          });
          if (!parsedMessage.content) return;

          onMessage?.(parsedMessage);
        });

        client.subscribe(`/topic/chat/rooms/${roomId}/read`, (message) => {
          const parsedEvent = parseReadEvent(parseBody(message), roomId);
          if (!parsedEvent) return;

          onRead?.(parsedEvent);
        });

        if (userId) {
          client.subscribe(`/topic/users/${userId}/typing`, (message) => {
            const parsedEvent = parseTypingEvent(parseBody(message));
            if (!parsedEvent) return;

            onTyping?.(parsedEvent);
          });
        }

        client.publish({
          destination: `/app/chat/rooms/${roomId}/read`,
          body: "",
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
      onStompError: () => {
        setIsConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      setIsConnected(false);
      clientRef.current = null;
      void client.deactivate();
    };
  }, [onMessage, onRead, onTyping, roomId, userId]);

  return {
    isConnected,
    sendMessage,
    sendRead,
    sendTyping,
  };
};



