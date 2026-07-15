// 실제 채팅방 화면
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { useChatRoomMembersPanel } from "../hooks/useChatRoomMembersPanel";
import { useChatRoomMessages } from "../hooks/useChatRoomMessages";
import type { ChatMessage, ChatRoom } from "../types";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ChatRoomMembersPanel from "./ChatRoomMembersPanel";

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

export default function ChatRoomPanel({
  room,onBack,
  onClose,
  onReadRoom,
  onRoomMessage,
  onLeaveRoom,
  onRoomUpdated,
  isLeaving,
}: ChatRoomPanelProps) {
  const {
    messages,
    currentUserId,
    currentUserNickname,
    isLoading,
    errorMessage,
    typingMessage,
    isConnected,
    sendMessage,
    sendTyping,
  } = useChatRoomMessages({
    room,
    onReadRoom,
    onRoomMessage,
  });

  const {
    panelMode,
    setPanelMode,
    members,
    selectedFriendIds,
    draftRoomName,
    setDraftRoomName,
    panelError,
    isPanelLoading,
    isPanelProcessing,
    isActionMenuOpen,
    setIsActionMenuOpen,
    addableFriends,
    openMembersPanel,
    openAddPanel,
    toggleFriend,
    handleAddMembers,
    handleRenameRoom,
    openRenamePanel,
  } = useChatRoomMembersPanel({
    room,
    onRoomUpdated,
  });

  const handleLeaveRoomClick = () => {
    setIsActionMenuOpen(false);
    onLeaveRoom?.(room);
  };

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

      <ChatRoomMembersPanel
        panelMode={panelMode}
        setPanelMode={setPanelMode}
        members={members}
        isPanelLoading={isPanelLoading}
        addableFriends={addableFriends}
        selectedFriendIds={selectedFriendIds}
        toggleFriend={toggleFriend}
        handleAddMembers={handleAddMembers}
        isPanelProcessing={isPanelProcessing}
        draftRoomName={draftRoomName}
        setDraftRoomName={setDraftRoomName}
        handleRenameRoom={handleRenameRoom}
        panelError={panelError}
      />

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




