"use client";

import { useLayoutEffect, useRef } from "react";
import type { ChatMessage, ChatRoomType } from "../types/chat";

type ChatMessageListProps = {
  messages: ChatMessage[];
  roomType: ChatRoomType;
  currentUserId?: number;
  currentUserNickname?: string;
  isLoading?: boolean;
};

const formatMessageTime = (value: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatMessageList({
  messages,
  roomType,
  currentUserId,
  currentUserNickname,
  isLoading,
}: ChatMessageListProps) {
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isLoading) return;

    const messageList = messageListRef.current;
    if (!messageList) return;

    messageList.scrollTop = messageList.scrollHeight;
  }, [isLoading, messages.length]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#F8FAFC] text-[14px] text-[#98A2B3]" role="status" aria-live="polite">
        채팅 내역을 불러오는 중입니다...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#F8FAFC] text-[14px] text-[#98A2B3]" role="status" aria-live="polite">
        아직 대화가 없습니다.
      </div>
    );
  }

  return (
    <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] px-4 py-4">
      {messages.map((message) => {
        const isMine = Boolean(
          message.isMine ||
            (currentUserId && message.senderId === currentUserId) ||
            (currentUserNickname && message.senderNickname === currentUserNickname)
        );
        const shouldShowUnreadCount = Boolean(
          message.unreadCount && (roomType === "GROUP" || isMine)
        );

        return (
          <div key={message.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[78%] flex-col ${isMine ? "items-end" : "items-start"}`}>
              {!isMine && (
                <span className="mb-1 text-[12px] font-semibold text-[#667085]">
                  {message.senderNickname}
                </span>
              )}
              <p
                className={`rounded-[16px] px-4 py-2 text-[14px] leading-6 ${
                  isMine
                    ? "rounded-br-[4px] bg-[#439A97] text-white"
                    : "rounded-bl-[4px] bg-white text-[#344054] shadow-sm"
                }`}
              >
                {message.content}
              </p>
              <span className={`mt-1 flex items-center gap-1 text-[11px] text-[#98A2B3] ${isMine ? "flex-row-reverse" : ""}`}>
                {shouldShowUnreadCount ? (
                  <span className="font-bold text-[#439A97]">{message.unreadCount}</span>
                ) : null}
                <span>{formatMessageTime(message.createdAt)}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

