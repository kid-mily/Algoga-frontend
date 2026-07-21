// 채팅방 내부 메시지와 WebSocket을 담당
import { useCallback, useEffect, useRef, useState } from "react";
import { getMe } from "@/features/services/user.service";
import { ApiRequestError } from "@/lib/api";
import { getChatMessages } from "../../services/chat.service";
import { useChatSocket } from "./useChatSocket";
import type { ChatMessage, ChatRoom, ReadEvent, TypingEvent } from "../types";

type UseChatRoomMessagesOptions = {
  room: ChatRoom;
  onReadRoom?: (roomId: number) => void;
  onRoomMessage?: (message: ChatMessage) => void;
  onRoomDeleted?: () => void;
};

const mergeMessage = (messages: ChatMessage[], nextMessage: ChatMessage) => {
  if (messages.some((message) => message.messageId === nextMessage.messageId)) {
    return messages;
  }

  return [...messages, nextMessage];
};

export const useChatRoomMessages = ({
  room,
  onReadRoom,
  onRoomMessage,
  onRoomDeleted,
}: UseChatRoomMessagesOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const sendReadRef = useRef<() => void>(() => undefined);
  const typingTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const loadMessages = useCallback(
    async (
      signal?: AbortSignal,
      options: { showLoading?: boolean } = {}
    ) => {
      const shouldShowLoading = options.showLoading ?? true;

      try {
        if (shouldShowLoading) {
          setIsLoading(true);
        }
        setErrorMessage("");

        const data = await getChatMessages(room.roomId, signal);
        setMessages(data);
      } catch (error) {
        if (signal?.aborted) return;

        if (
          error instanceof ApiRequestError &&
          error.status === 404 &&
          error.code === "CHAT_001"
        ) {
          onRoomDeleted?.();
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "채팅 내역을 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted && shouldShowLoading) {
          setIsLoading(false);
        }
      }
    },
    [onRoomDeleted, room.roomId]
  );

  const handleSocketMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => mergeMessage(prev, message));
      onRoomMessage?.(message);

      if (!message.isSystem) {
        window.setTimeout(() => {
          sendReadRef.current();
          void loadMessages(undefined, { showLoading: false });
        }, 0);
      }
    },
    [loadMessages, onRoomMessage]
  );

  const handleReadEvent = useCallback(
    (event: ReadEvent) => {
      if (
        !currentUserId ||
        event.roomId !== room.roomId ||
        event.readerId === currentUserId
      ) {
        return;
      }

      void loadMessages(undefined, { showLoading: false });
    },
    [currentUserId, loadMessages, room.roomId]
  );

  const handleTypingEvent = useCallback(
    (event: TypingEvent) => {
      if (event.roomId !== room.roomId) return;
      if (!currentUserId || event.userId === currentUserId) return;

      if (typingTimersRef.current[event.userId]) {
        clearTimeout(typingTimersRef.current[event.userId]);
        delete typingTimersRef.current[event.userId];
      }

      if (!event.isTyping) {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[event.userId];
          return next;
        });
        return;
      }

      setTypingUsers((prev) => ({
        ...prev,
        [event.userId]: event.nickname,
      }));

      typingTimersRef.current[event.userId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[event.userId];
          return next;
        });
        delete typingTimersRef.current[event.userId];
      }, 2500);
    },
    [currentUserId, room.roomId]
  );

  const { isConnected, sendMessage, sendRead, sendTyping } = useChatSocket({
    roomId: room.roomId,
    userId: currentUserId,
    onMessage: handleSocketMessage,
    onRead: handleReadEvent,
    onTyping: handleTypingEvent,
  });

  useEffect(() => {
    sendReadRef.current = sendRead;
  }, [sendRead]);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const user = await getMe();
      if (!isMounted || !user) return;

      setCurrentUserId(user.userId);
      setCurrentUserNickname(user.nickname);
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadMessages(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!isConnected) return;

    sendRead();
    onReadRoom?.(room.roomId);
  }, [isConnected, onReadRoom, room.roomId, sendRead]);

  useEffect(() => {
    if (!isConnected || isLoading || messages.length === 0) return;

    sendRead();
    onReadRoom?.(room.roomId);
  }, [isConnected, isLoading, messages.length, onReadRoom, room.roomId, sendRead]);

  useEffect(() => {
    const timers = typingTimersRef.current;

    return () => {
      Object.values(timers).forEach(clearTimeout);
      typingTimersRef.current = {};
    };
  }, []);

  const typingNames = Object.values(typingUsers);
  const typingMessage =
    typingNames.length === 1
      ? `${typingNames[0]}님이 입력 중입니다.`
      : typingNames.length > 1
        ? `${typingNames[0]}님 외 ${typingNames.length - 1}명이 입력 중입니다.`
        : "";

  return {
    messages,
    currentUserId,
    currentUserNickname,
    isLoading,
    errorMessage,
    typingMessage,
    isConnected,
    sendMessage,
    sendTyping,
  };
};

