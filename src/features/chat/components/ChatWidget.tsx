// 채팅방 전체 상태 관리
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useChatWidget } from "../hooks/useChatWidget";
import ChatListPanel from "./ChatListPanel";
import ChatRoomPanel from "./ChatRoomPanel";
import FriendSelectPanel from "./FriendSelectPanel";
import GroupChatCreatePanel from "./GroupChatCreatePanel";

const adminPathPrefixes = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdminPage = useMemo(
    () => adminPathPrefixes.some((prefix) => pathname.startsWith(prefix)),
    [pathname]
  );
  const {
    isOpen,
    view,
    setView,
    rooms,
    friends,
    selectedRoom,
    leaveTargetRoom,
    isLoadingRooms,
    isLoadingFriends,
    roomsError,
    friendsError,
    isProcessing,
    handleClose,
    handleStartDirectChat,
    handleStartGroupChat,
    handleCreateDirectChat,
    handleCreateGroupChat,
    handleCurrentRoomMessage,
    handleRoomUpdated,
    handleSelectRoom,
    markRoomAsRead,
    requestLeaveRoom,
    cancelLeaveRoom,
    handleLeaveRoom,
  } = useChatWidget({ isAdminPage });

  if (isAdminPage) return null; // 관리자 경로 채팅X

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-28 right-10 z-[9999]">
          {/* 채팅방 목록 */}
          {view === "list" && (
            <ChatListPanel
              rooms={rooms}
              isLoading={isLoadingRooms}
              errorMessage={roomsError}
              onClose={handleClose}
              onSelectRoom={handleSelectRoom}
              onStartDirectChat={handleStartDirectChat}
              onStartGroupChat={handleStartGroupChat}
              onLeaveRoom={requestLeaveRoom}
            />
          )}

          {/* 1: 1 채팅 만들기 */}
          {view === "direct-create" && (
            <FriendSelectPanel
              friends={friends}
              isLoading={isLoadingFriends || isProcessing}
              errorMessage={friendsError}
              onBack={() => setView("list")}
              onSelectFriend={handleCreateDirectChat}
            />
          )}

          {/* 그룹 채팅 만들기 */}
          {view === "group-create" && (
            <GroupChatCreatePanel
              friends={friends}
              isLoading={isLoadingFriends || isProcessing}
              errorMessage={friendsError}
              onBack={() => setView("list")}
              onCreateGroup={handleCreateGroupChat}
            />
          )}

          {/* 실제 채팅방 */}
          {view === "room" && selectedRoom && (
            <ChatRoomPanel
              key={selectedRoom.roomId}
              room={selectedRoom}
              onBack={() => setView("list")}
              onClose={handleClose}
              onReadRoom={markRoomAsRead}
              onRoomMessage={handleCurrentRoomMessage}
              onLeaveRoom={requestLeaveRoom}
              onRoomUpdated={handleRoomUpdated}
              isLeaving={isProcessing}
            />
          )}

          {leaveTargetRoom && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-black/20 px-5">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="chat-leave-title"
                aria-describedby="chat-leave-description"
                className="w-full max-w-[280px] rounded-[16px] bg-white p-5 text-center shadow-[0_16px_40px_rgba(16,24,40,0.24)]"
              >
                <h3 id="chat-leave-title" className="text-[17px] font-bold text-[#111827]">
                  채팅방 나가기
                </h3>
                <p id="chat-leave-description" className="mt-2 text-[13px] leading-5 text-[#667085]">
                  정말 이 채팅방을 나가시겠습니까?
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={cancelLeaveRoom}
                    disabled={isProcessing}
                    className="h-10 flex-1 rounded-[10px] border border-[#D0D5DD] bg-white text-[14px] font-semibold text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleLeaveRoom}
                    disabled={isProcessing}
                    className="h-10 flex-1 rounded-[10px] bg-[#E5484D] text-[14px] font-semibold text-white transition hover:bg-[#D92D20] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? "나가는 중" : "나가기"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
