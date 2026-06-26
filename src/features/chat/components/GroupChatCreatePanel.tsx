"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Friend } from "../types/chat";

type GroupChatCreatePanelProps = {
  friends: Friend[];
  isLoading?: boolean;
  errorMessage?: string;
  onBack: () => void;
  onCreateGroup: (roomName: string, friendIds: number[]) => void;
};

export default function GroupChatCreatePanel({
  friends,
  isLoading,
  errorMessage,
  onBack,
  onCreateGroup,
}: GroupChatCreatePanelProps) {
  const [roomName, setRoomName] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);

  const toggleFriend = (friendId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextRoomName = roomName.trim();
    if (!nextRoomName || selectedFriendIds.length < 2) return;

    onCreateGroup(nextRoomName, selectedFriendIds);
  };

  return (
    <section className="flex h-[540px] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" aria-label="그룹 채팅 생성">
      <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
        <button type="button" onClick={onBack} aria-label="채팅 목록으로 돌아가기" className="text-gray-500 transition hover:text-gray-900">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900">그룹 채팅</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">방 이름과 친구를 선택하세요</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-gray-100 px-5 py-4">
          <label htmlFor="group-room-name" className="text-[13px] font-semibold text-gray-700">
            채팅방 이름
          </label>
          <input
            id="group-room-name"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="예: 여행 친구방"
            className="mt-2 h-11 w-full rounded-2xl border border-gray-200 px-4 text-[14px] outline-none focus:border-[#439A97] focus:ring-2 focus:ring-[#C7E6E4]"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-[14px] text-gray-400" role="status" aria-live="polite">
              친구 목록을 불러오는 중입니다...
            </div>
          ) : errorMessage ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-[14px] text-red-500" role="alert">
              {errorMessage}
            </div>
          ) : friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map((friend) => {
                const isSelected = selectedFriendIds.includes(friend.friendId);

                return (
                  <li key={friend.friendId}>
                    <button
                      type="button"
                      onClick={() => toggleFriend(friend.friendId)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isSelected ? "bg-[#E7F4F3]" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F6F8] text-[15px] font-bold text-[#287875]">
                        {friend.nickname.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-gray-900">{friend.nickname}</span>
                      <span className={`h-5 w-5 rounded-full border ${isSelected ? "border-[#439A97] bg-[#439A97]" : "border-gray-300"}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full items-center justify-center text-[14px] text-gray-400">
              표시할 친구가 없습니다.
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-4">
          <button
            type="submit"
            disabled={!roomName.trim() || selectedFriendIds.length < 2}
            className="h-12 w-full rounded-2xl bg-[#439A97] text-[15px] font-bold text-white transition hover:bg-[#367c79] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            그룹 채팅 만들기
          </button>
        </div>
      </form>
    </section>
  );
}

