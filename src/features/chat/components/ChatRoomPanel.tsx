// 실제 채팅방 화면
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { useChatRoomMembersPanel } from "../hooks/useChatRoomMembersPanel";
import { useChatRoomMessages } from "../hooks/useChatRoomMessages";
import type { ChatMessage, ChatRoom } from "../types";
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




