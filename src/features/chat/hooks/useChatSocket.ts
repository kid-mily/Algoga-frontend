// 특정 채팅방 웹소켓 연결 담당
import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { normalizeChatMessage } from "../../services/chat.service";
import { getWebSocketUrl, parseBody } from "../socket";
import type { ChatMessage, ReadEvent, TypingEvent } from "../types";

type UseChatSocketOptions = {
  roomId?: number;
  userId?: number;
  onMessage?: (message: ChatMessage) => void;
  onRead?: (event: ReadEvent) => void;
  onTyping?: (event: TypingEvent) => void;
};

type RawRecord = Record<string, unknown>;

const getNumber = (record: RawRecord, keys: string[], fallback = 0) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== undefined && item !== null && item !== "");
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

// 채팅 읽었는지 확인
const parseReadEvent = (body: unknown, fallbackRoomId?: number): ReadEvent | null => {
  if (!body || typeof body !== "object") return null;

  const record = body as RawRecord;
  const roomId = getNumber(record, ["roomId"], fallbackRoomId ?? 0);
  const readerId = getNumber(record, ["readerId"]);

  if (roomId <= 0 || readerId <= 0) return null;

  return {
    roomId,
    readerId,
  };
};

const parseTypingEvent = (body: unknown): TypingEvent | null => {
  if (!body || typeof body !== "object") return null;

  const record = body as RawRecord;
  const roomId = getNumber(record, ["roomId"]);
  const userId = getNumber(record, ["userId"]);
  const nicknameValue = record.nickname;
  const isTypingValue = record.isTyping;

  if (userId <= 0 || typeof nicknameValue !== "string") return null;

  return {
    roomId,
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

  const onMessageRef = useRef(onMessage);
  const onReadRef = useRef(onRead);
  const onTypingRef = useRef(onTyping);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onReadRef.current = onRead;
  }, [onRead]);

  useEffect(() => {
    onTypingRef.current = onTyping;
  }, [onTyping]);

  const sendRead = useCallback(() => {
    const client = clientRef.current;
    if (!roomId || !client?.connected) return;

    client.publish({
      destination: `/app/chat/rooms/${roomId}/read`,
      body: "",
    });
  }, [roomId]);

  // 메시지 전송 담당
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
    // userId가 getMe로 늦게 채워지면 deps가 바뀌어 재연결되므로,
    // userId가 확정된 뒤에 한 번만 연결한다(진입당 불필요한 재연결 제거).
    if (!roomId || !userId) return;

    const client = new Client({
      brokerURL: getWebSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe(`/topic/chat/rooms/${roomId}`, (message) => {
          const rawMessage = parseBody(message);
          if (!rawMessage || typeof rawMessage !== "object") return;

          const parsedMessage = normalizeChatMessage({
            roomId,
            ...(rawMessage as Record<string, unknown>),
          });
          if (!parsedMessage.content) return;

          onMessageRef.current?.(parsedMessage);
        });

        client.subscribe(`/topic/chat/rooms/${roomId}/read`, (message) => {
          const parsedEvent = parseReadEvent(parseBody(message), roomId);
          if (!parsedEvent) return;

          onReadRef.current?.(parsedEvent);
        });

        if (userId) {
          client.subscribe(`/topic/users/${userId}/typing`, (message) => {
            const parsedEvent = parseTypingEvent(parseBody(message));
            if (!parsedEvent) return;

            onTypingRef.current?.(parsedEvent);
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
  }, [roomId, userId]);

  return {
    isConnected,
    sendMessage,
    sendRead,
    sendTyping,
  };
};





