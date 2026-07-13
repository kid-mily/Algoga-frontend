import Image from "next/image";
import type { Friend } from "../friend.types";

interface FriendItemProps {
  friend: Friend;
  onToggleFavorite: (friendId: number) => void;
  onSelect: (friend: Friend) => void;
}

// 친구 목록 패널에서 친구 한 명을 보여주는 항목입니다.
export default function FriendItem({
  friend,
  onToggleFavorite,
  onSelect,
}: FriendItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(friend)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect(friend);
      }}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#EEF8F7]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EEF8F7] text-sm font-bold text-[#357F7C]">
        {friend.profileImageUrl ? (
          <Image
            src={friend.profileImageUrl}
            alt={friend.nickname}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          friend.nickname.slice(0, 1)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-[#0A1628]">
            {friend.nickname}
          </p>

          {/* 온라인 상태를 알려주는 실제 데이터(필드/소켓)가 아직 없어
              디자인 확인용으로 모두 온라인으로 고정 표시합니다. */}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EEF8F7] px-2 py-0.5 text-[11px] font-bold text-[#439A97]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#439A97]" />
            온라인
          </span>
        </div>
        <p className="truncate text-xs text-[#8A9BB0]">@{friend.userId}</p>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(friend.friendId);
        }}
        aria-label={friend.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
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
        onClick={(event) => {
          event.stopPropagation();
          onSelect(friend);
        }}
        aria-label="채팅하기"
        className="shrink-0 rounded-full p-1.5 transition hover:bg-white"
      >
        <Image src="/images/ChatIcon.svg" alt="" width={18} height={18} />
      </button>
    </div>
  );
}
