"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import ChatCreateMenu from "./ChatCreateMenu";
import type { ChatRoom } from "../types/chat";

type ChatListPanelProps = {
  rooms: ChatRoom[];
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSelectRoom: (room: ChatRoom) => void;
  onStartDirectChat: () => void;
  onStartGroupChat: () => void;
  onLeaveRoom: (room: ChatRoom) => void;
};

const formatRoomTime = (value: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatListPanel({
  rooms,
  isLoading,
  errorMessage,
  onClose,
  onSelectRoom,
  onStartDirectChat,
  onStartGroupChat,
  onLeaveRoom,
}: ChatListPanelProps) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [menuRoomId, setMenuRoomId] = useState<number | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const clearLongPressTimer = () => {
    if (!longPressTimerRef.current) return;

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const handlePressStart = (room: ChatRoom) => {
    didLongPressRef.current = false;
    clearLongPressTimer();

    longPressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setMenuRoomId(room.roomId);
    }, 600);
  };

  const handlePressEnd = () => {
    clearLongPressTimer();
  };

  const handleRoomClick = (room: ChatRoom) => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    setMenuRoomId(null);
    onSelectRoom(room);
  };

  const handleLeaveRoom = (room: ChatRoom) => {
  // console.log("채팅방 나가기 클릭됨", room.roomId);
  setMenuRoomId(null);
  onLeaveRoom(room);
};
  

  return (
    <aside className="relative h-[540px] w-[360px] max-w-[calc(100vw-32px)] overflow-visible rounded-3xl bg-white shadow-2xl" aria-label="채팅 목록">
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">메시지</h2>

        <div className="flex items-center gap-3 text-gray-400">
          <button
            type="button"
            onClick={() => setIsCreateMenuOpen((prev) => !prev)}
            aria-label="새 채팅 메뉴 열기"
            className="transition hover:text-gray-700"
          >
            <Plus size={24} />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="채팅 닫기"
            className="transition hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {isCreateMenuOpen && (
        <>
          <button
            type="button"
            aria-label="새 채팅 메뉴 닫기"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsCreateMenuOpen(false)}
          />

          <ChatCreateMenu
            onStartOneToOneChat={() => {
              setIsCreateMenuOpen(false);
              onStartDirectChat();
            }}
            onStartGroupChat={() => {
              setIsCreateMenuOpen(false);
              onStartGroupChat();
            }}
          />
        </>
      )}

      <section className="h-[calc(540px-73px)] divide-y divide-gray-100 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-[14px] text-gray-400" role="status" aria-live="polite">
            채팅방을 불러오는 중입니다...
          </div>
        ) : errorMessage ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-[14px] text-red-500" role="alert">
            {errorMessage}
          </div>
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.roomId} className="relative">
              <button
                type="button"
                onPointerDown={() => handlePressStart(room)}
                onPointerUp={handlePressEnd}
                onPointerLeave={handlePressEnd}
                onClick={() => handleRoomClick(room)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setMenuRoomId(room.roomId);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6FA7A3] text-lg font-bold text-white">
                  {(room.roomName ?? "?").slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-bold text-gray-900">
                    {room.roomName ?? (room.type === "GROUP" ? "그룹 채팅" : "알 수 없는 상대")}
                  </p>

                  <p className="mt-1 truncate text-[15px] text-gray-500">
                    {room.lastMessage ?? "아직 메시지가 없습니다."}
                  </p>
                </div>

                <div className="flex w-[64px] shrink-0 flex-col items-end gap-1 self-start pt-1">
                  <span className="whitespace-nowrap text-[12px] text-gray-400">{formatRoomTime(room.lastMessageAt)}</span>
                  {room.unreadCount ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#6FA7A3] px-1.5 text-xs font-bold text-white">
                      {room.unreadCount}
                    </span>
                  ) : null}
                </div>
              </button>

              {menuRoomId === room.roomId && (
                <div className="absolute right-5 top-14 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleLeaveRoom(room)}
                    className="px-4 py-3 text-[14px] font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    채팅방 나가기
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-[14px] text-gray-400">
            참여 중인 채팅방이 없습니다.
          </div>
        )}
      </section>
    </aside>
  );
}
