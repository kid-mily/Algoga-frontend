import Image from "next/image";

import type { Friend } from "../friend.types";

interface FriendItemProps {
  friend: Friend;
  onToggleFavorite: (relationId: number) => void;
  onSelect: (friend: Friend) => void;
}

export default function FriendItem({
  friend,
  onToggleFavorite,
  onSelect,
}: FriendItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#EEF8F7]">
      <div className="relative h-11 w-11 shrink-0">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#EEF8F7] text-sm font-bold text-[#357F7C]">
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

        <span
          aria-label={friend.isOnline ? "온라인" : "오프라인"}
          className={[
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
            friend.isOnline ? "bg-[#439A97]" : "bg-[#C7D0DC]",
          ].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-[#0A1628]">
            {friend.nickname}
          </p>

          <span
            className={[
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
              friend.isOnline
                ? "bg-[#EEF8F7] text-[#439A97]"
                : "bg-[#F2F4F7] text-[#8A9BB0]",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                friend.isOnline ? "bg-[#439A97]" : "bg-[#AAB5C3]",
              ].join(" ")}
            />

            {friend.isOnline ? "온라인" : "오프라인"}
          </span>
        </div>

        <p className="truncate text-xs text-[#8A9BB0]">
          @{friend.personalCode}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onToggleFavorite(friend.relationId)}
        aria-label={
          friend.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
        }
        className="shrink-0 rounded-full p-1.5 transition hover:bg-white"
      >
        <Image
          src="/images/star.svg"
          alt=""
          width={16}
          height={16}
          className={friend.isFavorite ? "opacity-100" : "opacity-30"}
        />
      </button>

      <button
        type="button"
        onClick={() => onSelect(friend)}
        aria-label={`${friend.nickname}님과 채팅하기`}
        className="shrink-0 rounded-full p-1.5 transition hover:bg-white"
      >
        <Image
          src="/images/ChatIcon.svg"
          alt=""
          width={18}
          height={18}
        />
      </button>
    </div>
  );
}