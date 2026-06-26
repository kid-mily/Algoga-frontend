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
        const isSystemMessage = Boolean(message.isSystem || message.senderId === 0);

        if (isSystemMessage) {
          return (
            <div key={message.messageId} className="flex justify-center px-4">
              <p className="rounded-full bg-[#E4E7EC] px-3 py-1 text-center text-[12px] font-medium text-[#667085]">
                {message.content}
              </p>
            </div>
          );
        }

        const isMine = Boolean(
          message.isMine ||
            (currentUserId && message.senderId === currentUserId) ||
            (currentUserNickname && message.senderNickname === currentUserNickname)
        );
        const shouldShowUnreadCount = Boolean(
          message.unreadCount && (roomType === "GROUP" || isMine)
        );
        const messageMeta = (
          <span
            className={`flex shrink-0 flex-col gap-0.5 text-[11px] leading-tight text-[#98A2B3] ${
              isMine ? "items-end" : "items-start"
            }`}
          >
            {shouldShowUnreadCount ? (
              <span className="font-bold text-[#439A97]">{message.unreadCount}</span>
            ) : null}
            <span>{formatMessageTime(message.createdAt)}</span>
          </span>
        );

        return (
          <div key={message.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[86%] flex-col ${isMine ? "items-end" : "items-start"}`}>
              {!isMine && (
                <span className="mb-1 text-[12px] font-semibold text-[#667085]">
                  {message.senderNickname}
                </span>
              )}
              <div className={`flex max-w-full items-end gap-1.5 ${isMine ? "flex-row" : "flex-row-reverse"}`}>
                {messageMeta}
                <p
                  className={`min-w-0 break-words rounded-[16px] px-4 py-2 text-[14px] leading-6 ${
                    isMine
                      ? "rounded-br-[4px] bg-[#439A97] text-white"
                      : "rounded-bl-[4px] bg-white text-[#344054] shadow-sm"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


