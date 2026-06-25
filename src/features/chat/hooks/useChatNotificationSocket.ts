import { useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type { RoomNotification } from "../types/chat";

type UseChatNotificationSocketOptions = {
  userId?: number;
  onNotification?: (notification: RoomNotification) => void;
};

type SocketEnvelope = {
  data?: unknown;
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

const parseNotification = (body: unknown): RoomNotification | null => {
  const unwrappedBody = unwrapBody(body);
  if (!unwrappedBody || typeof unwrappedBody !== "object") return null;

  const record = unwrappedBody as Record<string, unknown>;
  const roomId = Number(record.roomId);
  const unreadCount = Number(record.unreadCount);
  const lastMessage = typeof record.lastMessage === "string" ? record.lastMessage : "";
  const lastMessageAt = typeof record.lastMessageAt === "string" ? record.lastMessageAt : "";

  if (!Number.isFinite(roomId)) return null;

  return {
    roomId,
    lastMessage,
    lastMessageAt,
    unreadCount: Number.isFinite(unreadCount) ? unreadCount : 0,
  };
};

export const useChatNotificationSocket = ({
  userId,
  onNotification,
}: UseChatNotificationSocketOptions) => {
  const clientRef = useRef<Client | null>(null);
  const onNotificationRef = useRef(onNotification);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: getWebSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe(`/topic/users/${userId}`, (message) => {
          const notification = parseNotification(parseBody(message));
          if (!notification) return;

          onNotificationRef.current?.(notification);
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
  }, [userId]);

  return { isConnected };
};
