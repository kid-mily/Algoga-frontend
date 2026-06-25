import { useCallback, useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type { ChatMessage, ReadEvent } from "../types/chat";

type UseChatSocketOptions = {
  roomId?: number;
  onMessage?: (message: ChatMessage) => void;
  onRead?: (event: ReadEvent) => void;
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

const parseReadEvent = (body: unknown, fallbackRoomId?: number): ReadEvent | null => {
  const unwrappedBody = unwrapBody(body);
  if (!unwrappedBody || typeof unwrappedBody !== "object") return null;

  const record = unwrappedBody as RawRecord;
  const roomId = getNumber(record, ["roomId", "chatRoomId", "id"], fallbackRoomId ?? 0);
  const readerId = getNumber(record, ["readerId", "userId", "memberId", "readerUserId", "readUserId"]);

  if (roomId <= 0 || readerId <= 0) return null;

  return { roomId, readerId };
};

export const useChatSocket = ({ roomId, onMessage, onRead }: UseChatSocketOptions) => {
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
          const parsedMessage = unwrapBody(parseBody(message)) as ChatMessage | null;
          if (!parsedMessage) return;

          onMessage?.(parsedMessage);
        });

        client.subscribe(`/topic/chat/rooms/${roomId}/read`, (message) => {
          const parsedEvent = parseReadEvent(parseBody(message), roomId);
          if (!parsedEvent) return;

          onRead?.(parsedEvent);
        });

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
  }, [onMessage, onRead, roomId]);

  return {
    isConnected,
    sendMessage,
    sendRead,
  };
};


