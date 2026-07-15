// 채팅방 목록/ 실시간 알림 담당

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getWebSocketUrl, parseBody } from "../socket";
import type { RoomNotification } from "../types";

type UseChatNotificationSocketOptions = {
  userId?: number;
  onNotification?: (notification: RoomNotification) => void;
  onConnected?: () => void;
};

const parseNotification = (body: unknown): RoomNotification | null => {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
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
  onConnected,
}: UseChatNotificationSocketOptions) => {
  const clientRef = useRef<Client | null>(null);
  const onNotificationRef = useRef(onNotification);
  const onConnectedRef = useRef(onConnected);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: getWebSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        client.subscribe(`/topic/users/${userId}`, (message) => {
          const notification = parseNotification(parseBody(message));
          if (!notification) return;

          onNotificationRef.current?.(notification);
        });

        onConnectedRef.current?.();
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      void client.deactivate();
    };
  }, [userId]);
};

