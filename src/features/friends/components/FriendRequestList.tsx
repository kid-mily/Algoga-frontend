import Image from "next/image";

import type { Friend } from "../friend.types";
import { EmptyState } from "./FriendPanel";

interface FriendRequestListProps {
  requests: Friend[];
  processingId: number | null;
  onAccept: (requestId: number) => Promise<void>;
  onReject: (requestId: number) => Promise<void>;
}

export default function FriendRequestList({
  requests,
  processingId,
  onAccept,
  onReject,
}: FriendRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="px-5 py-8">
        <EmptyState
          title="받은 친구 요청이 없습니다."
          description="새로운 친구 요청이 오면 이곳에서 확인할 수 있어요."
        />
      </div>
    );
  }

  return (
    <ul className="space-y-1 px-3 py-3">
      {requests.map((friend) => {
        const isProcessing = processingId === friend.relationId;

        return (
          <li
            key={friend.relationId}
            className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#F8FBFD]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EEF8F7] text-sm font-bold text-[#357F7C]">
              {friend.profileImageUrl ? (
                <Image
                  src={friend.profileImageUrl}
                  alt={`${friend.nickname} 프로필`}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                friend.nickname.slice(0, 1)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#0A1628]">{friend.nickname}</p>
              <p className="truncate text-xs text-[#8A9BB0]">@{friend.personalCode}</p>
            </div>

            <button
              type="button"
              onClick={() => void onReject(friend.relationId)}
              disabled={isProcessing}
              className="h-9 rounded-xl border border-[#D8E1EA] px-3 text-xs font-bold text-[#718096] transition hover:bg-[#F3F8FC] disabled:opacity-60"
            >
              거절
            </button>
            <button
              type="button"
              onClick={() => void onAccept(friend.relationId)}
              disabled={isProcessing}
              className="h-9 rounded-xl bg-[#439A97] px-3 text-xs font-bold text-white transition hover:bg-[#357F7C] disabled:opacity-60"
            >
              수락
            </button>
          </li>
        );
      })}
    </ul>
  );
}
