"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, LogOut, X } from "lucide-react";
import { getMe } from "@/features/services/user.service";
import { getChatMessages } from "../services/chatService";
import { useChatSocket } from "../hooks/useChatSocket";
import type { ChatMessage, ChatRoom } from "../types/chat";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

type ChatRoomPanelProps = {
  room: ChatRoom;
  onBack: () => void;
  onClose: () => void;
  onReadRoom?: (roomId: number) => void;
  onRoomMessage?: (message: ChatMessage) => void;
  onLeaveRoom?: (room: ChatRoom) => void;
  isLeaving?: boolean;
};

const mergeMessage = (messages: ChatMessage[], nextMessage: ChatMessage) => {
  if (messages.some((message) => message.messageId === nextMessage.messageId)) {
    return messages;
  }

  return [...messages, nextMessage];
};

const ChatRoomHeaderAvatar = ({ room, roomName }: { room: ChatRoom; roomName: string }) => {
  const shouldShowProfileImage = room.type === "DIRECT" && Boolean(room.profileImageUrl);

  if (shouldShowProfileImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={room.profileImageUrl ?? ""}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-full border border-[#E4E7EC] object-cover"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F4F3] text-[15px] font-bold text-[#287875]">
      {roomName.slice(0, 1)}
    </span>
  );
};

export default function ChatRoomPanel({
  room,
  onBack,
  onClose,
  onReadRoom,
  onRoomMessage,
  onLeaveRoom,
  isLeaving,
}: ChatRoomPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const sendReadRef = useRef<() => void>(() => undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSocketMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => mergeMessage(prev, message));
      onRoomMessage?.(message);

      if (!message.isSystem && currentUserId && message.senderId !== currentUserId) {
        sendReadRef.current();
      }
    },
    [currentUserId, onRoomMessage]
  );

  const handleReadEvent = useCallback(
    (event: { roomId: number; readerId?: number; messageId?: number; unreadCount?: number }) => {
      if (!currentUserId || event.roomId !== room.roomId || event.readerId === currentUserId) return;

      setMessages((prev) =>
        prev.map((message) => {
          const isReaderMessage = Boolean(
            event.readerId && message.senderId === event.readerId
          );

          if (isReaderMessage || !message.unreadCount) return message;

          if (event.messageId && message.messageId !== event.messageId) {
            return message;
          }

          return {
            ...message,
            unreadCount:
              typeof event.unreadCount === "number"
                ? Math.max(event.unreadCount, 0)
                : room.type === "GROUP"
                  ? Math.max(message.unreadCount - 1, 0)
                  : 0,
          };
        })
      );
    },
    [currentUserId, room.roomId, room.type]
  );

  const { isConnected, sendMessage, sendRead } = useChatSocket({
    roomId: room.roomId,
    onMessage: handleSocketMessage,
    onRead: handleReadEvent,
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

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getChatMessages(room.roomId, controller.signal);
        setMessages(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(error instanceof Error ? error.message : "채팅 내역을 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      controller.abort();
    };
  }, [room.roomId]);

  useEffect(() => {
    if (!isConnected) return;

    sendRead();
    onReadRoom?.(room.roomId);
  }, [isConnected, onReadRoom, room.roomId, sendRead]);

  const roomName = room.roomName ?? (room.type === "GROUP" ? "그룹 채팅" : "알 수 없는 상대");

  return (
    <section
      aria-label={`${roomName} 채팅방`}
      className="flex h-[560px] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white shadow-[0_24px_60px_rgba(16,24,40,0.18)]"
    >
      <header className="flex h-[72px] items-center justify-between border-b border-[#EEF2F6] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="채팅 목록으로 돌아가기"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#667085] transition hover:bg-[#F2F4F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#439A97]"
          >
            <ArrowLeft size={19} />
          </button>
          <ChatRoomHeaderAvatar room={room} roomName={roomName} />
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-bold text-[#111827]">{roomName}</h2>
            <p className="mt-0.5 text-[12px] text-[#98A2B3]">
              {isConnected ? "실시간 연결됨" : "연결 중"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onLeaveRoom && (
            <button
              type="button"
              onClick={() => onLeaveRoom(room)}
              disabled={isLeaving}
              aria-label="채팅방 나가기"
              title="채팅방 나가기"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#667085] transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF4444]"
            >
              <LogOut size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="채팅창 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#667085] transition hover:bg-[#F2F4F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#439A97]"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {errorMessage ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[14px] text-red-500" role="alert">
          {errorMessage}
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          roomType={room.type}
          currentUserId={currentUserId}
          currentUserNickname={currentUserNickname}
          isLoading={isLoading}
        />
      )}

      <ChatInput disabled={!isConnected} onSend={sendMessage} />
    </section>
  );
}




