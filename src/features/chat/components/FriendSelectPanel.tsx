// 1:1 채팅 시작할 친구를 선택
import { ArrowLeft } from "lucide-react";
import type { Friend } from "../types";
import FriendAvatar from "./FriendAvatar";

type FriendSelectPanelProps = {
  friends: Friend[];
  isLoading?: boolean;
  errorMessage?: string;
  onBack: () => void;
  onSelectFriend: (friend: Friend) => void;
};

export default function FriendSelectPanel({
  friends,
  isLoading,
  errorMessage,
  onBack,
  onSelectFriend,
}: FriendSelectPanelProps) {
  return (
    <section className="flex h-[540px] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" aria-label="새 채팅 친구 선택">
      <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
        <button type="button" onClick={onBack} aria-label="채팅 목록으로 돌아가기" className="text-gray-500 transition hover:text-gray-900">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900">새 채팅</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">대화할 친구를 선택하세요</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-3">
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
            {friends.map((friend) => (
              <li key={friend.friendId}>
                <button
                  type="button"
                  onClick={() => onSelectFriend(friend)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-gray-50"
                >
                  <FriendAvatar friend={friend} />
                  <span className="truncate text-[15px] font-bold text-gray-900">{friend.nickname}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center text-[14px] text-gray-400">
            표시할 친구가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
