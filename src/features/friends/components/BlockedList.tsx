"use client";

import Image from "next/image";
import { useState } from "react";

import Modal from "@/features/common/components/Modal";
import type { Friend } from "../friend.types";
import { EmptyState } from "./FriendPanel";

interface BlockedListProps {
  blockedUsers: Friend[];
  processingCode: string | null;
  onUnblock: (personalCode: string) => Promise<void>;
}

export default function BlockedList({
  blockedUsers,
  processingCode,
  onUnblock,
}: BlockedListProps) {
  const [unblockTarget, setUnblockTarget] = useState<Friend | null>(null);

  const handleConfirmUnblock = async () => {
    if (!unblockTarget) return;

    await onUnblock(unblockTarget.personalCode);
    setUnblockTarget(null);
  };

  if (blockedUsers.length === 0) {
    return (
      <div className="px-5 py-8">
        <EmptyState
          title="차단한 사용자가 없습니다."
          description="차단한 친구가 생기면 이곳에서 확인할 수 있어요."
        />
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-1 px-3 py-3">
        {blockedUsers.map((friend) => (
        <li
          key={`${friend.userId}-${friend.personalCode}`}
          className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#F8FBFD]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3F4F6] text-sm font-bold text-[#667085]">
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
            onClick={() => setUnblockTarget(friend)}
            disabled={processingCode === friend.personalCode}
            className="h-9 shrink-0 rounded-xl border border-[#D8E1EA] px-3 text-xs font-bold text-[#718096] transition hover:bg-[#F3F8FC] disabled:opacity-60"
          >
            차단 해제
          </button>
        </li>
        ))}
      </ul>

      <Modal
        open={unblockTarget !== null}
        title="차단을 해제할까요?"
        description={
          unblockTarget
            ? `${unblockTarget.nickname}님의 차단을 해제하면 다시 친구 목록에 표시됩니다.`
            : "차단을 해제하면 다시 친구 목록에 표시됩니다."
        }
        confirmText="차단 해제"
        cancelText="취소"
        confirmDisabled={
          unblockTarget !== null &&
          processingCode === unblockTarget.personalCode
        }
        onConfirm={() => void handleConfirmUnblock()}
        onCancel={() => setUnblockTarget(null)}
      />
    </>
  );
}
