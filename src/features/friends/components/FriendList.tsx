"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/features/common/components/Modal";
import type { Friend } from "@/features/chat/types";
import FriendSearch from "./FriendSearch";
import { EmptyState } from "./FriendPanel";

interface FriendListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: number) => void;
}

type ConfirmMode = "block" | "delete";

export default function FriendList({ friends, onRemoveFriend }: FriendListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [openMenuFriendId, setOpenMenuFriendId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    friend: Friend;
    mode: ConfirmMode;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest("[data-friend-menu]")) {
        setOpenMenuFriendId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredFriends = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return friends;

    return friends.filter((friend) =>
      friend.nickname.toLowerCase().includes(keyword)
    );
  }, [friends, searchValue]);

  const handleConfirm = async () => {
    if (!confirmTarget) return;

    setIsProcessing(true);

    try {
      onRemoveFriend(confirmTarget.friend.friendId);
      setOpenMenuFriendId(null);
      setConfirmTarget(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="px-5 py-4">
        <FriendSearch value={searchValue} onChange={setSearchValue} />
      </div>

      <div ref={listRef} className="max-h-[calc(100vh-320px)] overflow-y-auto px-3 pb-3">
        {friends.length === 0 ? (
          <EmptyState
            title="아직 등록된 친구가 없습니다."
            description="개인 번호로 친구를 추가해 보세요."
          />
        ) : filteredFriends.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="친구 닉네임을 다시 확인해 주세요."
          />
        ) : (
          <ul className="space-y-1">
            {filteredFriends.map((friend) => (
              <li
                key={friend.friendId}
                className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#F8FBFD]"
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

                <div className="flex min-w-0 flex-1 items-center gap-2">
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

                <div className="relative shrink-0" data-friend-menu>
                  <button
                    type="button"
                    aria-label="친구 메뉴 열기"
                    onClick={() =>
                      setOpenMenuFriendId((prev) =>
                        prev === friend.friendId ? null : friend.friendId
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-[#8A9BB0] transition hover:bg-[#EEF8F7] hover:text-[#439A97]"
                  >
                    ...
                  </button>

                  {openMenuFriendId === friend.friendId && (
                    <div className="absolute right-0 top-9 z-10 w-32 overflow-hidden rounded-xl border border-[#E5EDF5] bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => setConfirmTarget({ friend, mode: "block" })}
                        className="block w-full px-4 py-2 text-left text-sm text-[#0A1628] hover:bg-[#F3F8FC]"
                      >
                        차단하기
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmTarget({ friend, mode: "delete" })}
                        className="block w-full px-4 py-2 text-left text-sm text-[#B54747] hover:bg-[#FFF1F1]"
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={confirmTarget !== null}
        title={
          confirmTarget?.mode === "block"
            ? "친구를 차단할까요?"
            : "친구를 삭제할까요?"
        }
        description={
          confirmTarget?.mode === "block"
            ? "차단하면 친구 목록에서 제외되며 일부 기능이 제한될 수 있습니다."
            : "삭제 후 다시 친구가 되려면 친구 요청을 다시 보내야 합니다."
        }
        confirmText={confirmTarget?.mode === "block" ? "차단하기" : "삭제하기"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}