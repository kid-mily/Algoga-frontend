"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { getMe } from "@/features/services/user.service";
import {
  addChatRoomMembers,
  getChatMessages,
  getChatRoomMembers,
  getFriends,
  renameChatRoom,
} from "../services/chatService";
import { useChatSocket } from "../hooks/useChatSocket";
import type {
  ChatMessage,
  ChatRoom,
  ChatRoomMember,
  Friend,
  TypingEvent,
} from "../types/chat";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

type ChatRoomPanelProps = {
  room: ChatRoom;
  onBack: () => void;
  onClose: () => void;
  onReadRoom?: (roomId: number) => void;
  onRoomMessage?: (message: ChatMessage) => void;
  onLeaveRoom?: (room: ChatRoom) => void;
  onRoomUpdated?: (room: ChatRoom) => void;
  isLeaving?: boolean;
};

const mergeMessage = (messages: ChatMessage[], nextMessage: ChatMessage) => {
  if (messages.some((message) => message.messageId === nextMessage.messageId)) {
    return messages;
  }

  return [...messages, nextMessage];
};

const ChatRoomHeaderAvatar = ({ room, roomName }: { room: ChatRoom; roomName: string }) => {
  if (room.type === "GROUP") return null;

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

const MemberAvatar = ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) => {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 shrink-0 rounded-full border border-[#E4E7EC] object-cover"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F4F3] text-[13px] font-bold text-[#287875]">
      {name.slice(0, 1)}
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
  onRoomUpdated,
  isLeaving,
}: ChatRoomPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [currentUserNickname, setCurrentUserNickname] = useState("");
  const sendReadRef = useRef<() => void>(() => undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [panelMode, setPanelMode] = useState<"none" | "members" | "add" | "rename">("none");
  const [members, setMembers] = useState<ChatRoomMember[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
  const [draftRoomName, setDraftRoomName] = useState(room.roomName ?? "");
  const [panelError, setPanelError] = useState("");
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [isPanelProcessing, setIsPanelProcessing] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
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

        setErrorMessage(error instanceof Error ? error.message : "채팅 내역을 불러오지 못했습니다.");
      } finally {
        if (!signal?.aborted && shouldShowLoading) {
          setIsLoading(false);
        }
      }
    },
    [room.roomId]
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
    (event: { roomId: number; readerId?: number; messageId?: number; unreadCount?: number }) => {
      if (!currentUserId || event.roomId !== room.roomId || event.readerId === currentUserId) return;
      if (!event.messageId || typeof event.unreadCount !== "number") {
        void loadMessages(undefined, { showLoading: false });
        return;
      }

      const nextUnreadCount = Math.max(event.unreadCount, 0);

      setMessages((prev) =>
        prev.map((message) => {
          const isReaderMessage = Boolean(
            event.readerId && message.senderId === event.readerId
          );

          if (isReaderMessage || !message.unreadCount) return message;

          if (message.messageId !== event.messageId) {
            return message;
          }

          return {
            ...message,
            unreadCount: nextUnreadCount,
          };
        })
      );
    },
    [currentUserId, loadMessages, room.roomId]
  );

  const handleTypingEvent = useCallback(
    (event: TypingEvent) => {
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
    [currentUserId]
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

    loadCurrentUser();

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

  const roomName = room.roomName ?? (room.type === "GROUP" ? "그룹 채팅" : "알 수 없는 상대");
  const typingNames = Object.values(typingUsers);
  const typingMessage =
    typingNames.length === 1
      ? `${typingNames[0]}님이 입력 중입니다.`
      : typingNames.length > 1
        ? `${typingNames[0]}님 외 ${typingNames.length - 1}명이 입력 중입니다.`
        : "";
  const memberIdSet = new Set(members.map((member) => member.userId));
  const addableFriends = friends.filter((friend) => !memberIdSet.has(friend.friendId));

  const loadMembers = async () => {
    try {
      setIsPanelLoading(true);
      setPanelError("");
      const data = await getChatRoomMembers(room.roomId);
      setMembers(data);
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "멤버 목록을 불러오지 못했습니다.");
    } finally {
      setIsPanelLoading(false);
    }
  };

  const openMembersPanel = () => {
    setIsActionMenuOpen(false);
    setPanelMode("members");
    void loadMembers();
  };

  const openAddPanel = async () => {
    setIsActionMenuOpen(false);
    setPanelMode("add");
    setSelectedFriendIds([]);

    try {
      setIsPanelLoading(true);
      setPanelError("");
      const [nextMembers, nextFriends] = await Promise.all([
        getChatRoomMembers(room.roomId),
        getFriends(),
      ]);
      setMembers(nextMembers);
      setFriends(nextFriends);
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "친구 목록을 불러오지 못했습니다.");
    } finally {
      setIsPanelLoading(false);
    }
  };

  const toggleFriend = (friendId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddMembers = async () => {
    if (!selectedFriendIds.length || isPanelProcessing) return;

    try {
      setIsPanelProcessing(true);
      setPanelError("");
      const nextRoom = await addChatRoomMembers(room.roomId, selectedFriendIds);
      onRoomUpdated?.(nextRoom);
      setSelectedFriendIds([]);
      setPanelMode("members");
      await loadMembers();
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "멤버를 추가하지 못했습니다.");
    } finally {
      setIsPanelProcessing(false);
    }
  };

  const handleRenameRoom = async () => {
    const nextName = draftRoomName.trim();
    if (room.type !== "GROUP" || !nextName || nextName.length > 20 || isPanelProcessing) return;

    try {
      setIsPanelProcessing(true);
      setPanelError("");
      await renameChatRoom(room.roomId, nextName);
      onRoomUpdated?.({ ...room, roomName: nextName });
      setPanelMode("none");
    } catch (error) {
      setPanelError(error instanceof Error ? error.message : "채팅방 이름을 변경하지 못했습니다.");
    } finally {
      setIsPanelProcessing(false);
    }
  };

  const openRenamePanel = () => {
    setIsActionMenuOpen(false);
    setDraftRoomName(room.roomName ?? "");
    setPanelMode("rename");
  };

  const handleLeaveRoomClick = () => {
    setIsActionMenuOpen(false);
    onLeaveRoom?.(room);
  };

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
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setIsActionMenuOpen((prev) => !prev)}
            aria-label="채팅방 메뉴 열기"
            aria-expanded={isActionMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#667085] transition hover:bg-[#F2F4F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#439A97]"
          >
            <MoreVertical size={20} />
          </button>
          {isActionMenuOpen && (
            <div className="absolute right-10 top-10 z-30 w-[180px] overflow-hidden rounded-[14px] border border-[#E4E7EC] bg-white py-1 shadow-[0_12px_30px_rgba(16,24,40,0.16)]">
              <button
                type="button"
                onClick={openMembersPanel}
                className="block w-full px-4 py-3 text-left text-[14px] font-semibold text-[#344054] transition hover:bg-[#F9FAFB]"
              >
                멤버 목록
              </button>
              <button
                type="button"
                onClick={openAddPanel}
                className="block w-full px-4 py-3 text-left text-[14px] font-semibold text-[#344054] transition hover:bg-[#F9FAFB]"
              >
                멤버 추가
              </button>
              {room.type === "GROUP" && (
                <button
                  type="button"
                  onClick={openRenamePanel}
                  className="block w-full px-4 py-3 text-left text-[14px] font-semibold text-[#344054] transition hover:bg-[#F9FAFB]"
                >
                  채팅방 이름 수정
                </button>
              )}
              {onLeaveRoom && (
                <button
                  type="button"
                  onClick={handleLeaveRoomClick}
                  disabled={isLeaving}
                  className="block w-full px-4 py-3 text-left text-[14px] font-semibold text-[#D92D20] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  나가기
                </button>
              )}
            </div>
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

      {panelMode !== "none" && (
        <section className="border-b border-[#EEF2F6] bg-[#F9FAFB] px-4 py-3">
          {panelMode === "members" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#111827]">멤버 목록</p>
                <button
                  type="button"
                  onClick={() => setPanelMode("none")}
                  className="text-[12px] font-semibold text-[#667085]"
                >
                  닫기
                </button>
              </div>
              {isPanelLoading ? (
                <p className="text-[13px] text-[#98A2B3]">멤버를 불러오는 중입니다...</p>
              ) : (
                <ul className="max-h-[132px] space-y-2 overflow-y-auto">
                  {members.map((member) => (
                    <li key={member.userId} className="flex items-center gap-2">
                      <MemberAvatar name={member.nickname} imageUrl={member.profileImageUrl} />
                      <span className="truncate text-[13px] font-semibold text-[#344054]">
                        {member.nickname}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {panelMode === "add" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#111827]">멤버 추가</p>
                <button
                  type="button"
                  onClick={() => setPanelMode("none")}
                  className="text-[12px] font-semibold text-[#667085]"
                >
                  닫기
                </button>
              </div>
              {isPanelLoading ? (
                <p className="text-[13px] text-[#98A2B3]">친구를 불러오는 중입니다...</p>
              ) : addableFriends.length > 0 ? (
                <ul className="max-h-[132px] space-y-2 overflow-y-auto">
                  {addableFriends.map((friend) => {
                    const isSelected = selectedFriendIds.includes(friend.friendId);

                    return (
                      <li key={friend.friendId}>
                        <button
                          type="button"
                          onClick={() => toggleFriend(friend.friendId)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center gap-2 rounded-[12px] px-2 py-2 text-left ${
                            isSelected ? "bg-[#E7F4F3]" : "bg-white"
                          }`}
                        >
                          <MemberAvatar name={friend.nickname} imageUrl={friend.profileImageUrl} />
                          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#344054]">
                            {friend.nickname}
                          </span>
                          <span className={`h-4 w-4 rounded-full border ${
                            isSelected ? "border-[#439A97] bg-[#439A97]" : "border-[#D0D5DD]"
                          }`} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[13px] text-[#98A2B3]">추가할 수 있는 친구가 없습니다.</p>
              )}
              <button
                type="button"
                onClick={handleAddMembers}
                disabled={!selectedFriendIds.length || isPanelProcessing}
                className="mt-3 h-9 w-full rounded-[10px] bg-[#439A97] text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isPanelProcessing ? "추가 중" : "선택한 멤버 추가"}
              </button>
            </div>
          )}

          {panelMode === "rename" && (
            <div>
              <label htmlFor="chat-room-name" className="text-[13px] font-bold text-[#111827]">
                채팅방 이름 변경
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="chat-room-name"
                  value={draftRoomName}
                  onChange={(event) => setDraftRoomName(event.target.value)}
                  maxLength={20}
                  className="h-9 min-w-0 flex-1 rounded-[10px] border border-[#D0D5DD] bg-white px-3 text-[13px] outline-none focus:border-[#439A97] focus:ring-2 focus:ring-[#C7E6E4]"
                />
                <button
                  type="button"
                  onClick={handleRenameRoom}
                  disabled={!draftRoomName.trim() || isPanelProcessing}
                  className="h-9 rounded-[10px] bg-[#439A97] px-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                >
                  저장
                </button>
              </div>
            </div>
          )}

          {panelError ? (
            <p className="mt-2 text-[12px] font-semibold text-red-500" role="alert">
              {panelError}
            </p>
          ) : null}
        </section>
      )}

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

      {typingMessage ? (
        <p className="border-t border-[#EEF2F6] bg-white px-4 pt-2 text-[12px] font-semibold text-[#667085]">
          {typingMessage}
        </p>
      ) : null}

      <ChatInput
        disabled={!isConnected}
        onSend={sendMessage}
        onTypingChange={sendTyping}
      />
    </section>
  );
}




