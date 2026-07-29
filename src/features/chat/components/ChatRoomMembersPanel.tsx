import type { ChatRoomPanelMode } from "../hooks/useChatRoomMembersPanel";
import type { ChatRoomMember, Friend } from "../types";

type ChatRoomMembersPanelProps = {
  panelMode: ChatRoomPanelMode;
  setPanelMode: (mode: ChatRoomPanelMode) => void;
  members: ChatRoomMember[];
  isPanelLoading: boolean;
  addableFriends: Friend[];
  selectedFriendIds: number[];
  toggleFriend: (friendId: number) => void;
  handleAddMembers: () => void;
  isPanelProcessing: boolean;
  draftRoomName: string;
  setDraftRoomName: (value: string) => void;
  handleRenameRoom: () => void;
  panelError: string;
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

export default function ChatRoomMembersPanel({
  panelMode,
  setPanelMode,
  members,
  isPanelLoading,
  addableFriends,
  selectedFriendIds,
  toggleFriend,
  handleAddMembers,
  isPanelProcessing,
  draftRoomName,
  setDraftRoomName,
  handleRenameRoom,
  panelError,
}: ChatRoomMembersPanelProps) {
  if (panelMode === "none") return null;

  return (
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
  );
}
