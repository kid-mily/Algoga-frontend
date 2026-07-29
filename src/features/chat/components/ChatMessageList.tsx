// 메시지 목록 렌더링
import { Fragment, memo, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import type { ChatMessage, ChatRoomType } from "../types";

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

const getDatePart = (value: string) => value.slice(0, 10);

const formatDateSeparator = (value: string) => {
  const [year, month, day] = getDatePart(value).split("-");
  if (!year || !month || !day) return value;

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const MessageAvatar = ({
  nickname,
  imageUrl,
}: {
  nickname: string;
  imageUrl: string | null;
}) => {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="mt-5 h-8 w-8 shrink-0 rounded-full border border-[#E4E7EC] object-cover"
      />
    );
  }

  return (
    <span className="mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F4F3] text-[12px] font-bold text-[#287875]">
      {nickname.slice(0, 1)}
    </span>
  );
};

function ChatMessageList({
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
      {messages.map((message, index) => {
        const showDateSeparator =
          index === 0 ||
          getDatePart(message.createdAt) !== getDatePart(messages[index - 1].createdAt);

        const dateSeparator = showDateSeparator ? (
          <div className="flex justify-center px-4 py-1">
            <p className="rounded-full bg-[#E4E7EC] px-3 py-1 text-center text-[12px] font-medium text-[#667085]">
              {formatDateSeparator(message.createdAt)}
            </p>
          </div>
        ) : null;

        const isSystemMessage = Boolean(message.isSystem || message.senderId === 0);

        if (isSystemMessage) {
          return (
            <Fragment key={message.messageId}>
              {dateSeparator}
              <div className="flex justify-center px-4">
                <p className="rounded-full bg-[#E4E7EC] px-3 py-1 text-center text-[12px] font-medium text-[#667085]">
                  {message.content}
                </p>
              </div>
            </Fragment>
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
          <Fragment key={message.messageId}>
            {dateSeparator}
            <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[90%] gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <MessageAvatar
                    nickname={message.senderNickname}
                    imageUrl={message.senderProfileImageUrl}
                  />
                )}
                <div className={`flex min-w-0 flex-col ${isMine ? "items-end" : "items-start"}`}>
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
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ChatRoomPanel이 타이핑/연결상태 변경으로 자주 리렌더되어도
// messages 등 props가 그대로면 메시지 목록 재계산을 건너뛴다.
export default memo(ChatMessageList);


