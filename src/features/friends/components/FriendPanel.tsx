"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DUMMY_FRIENDS } from "../friend.data";
import type { Friend, FriendFilter } from "../friend.types";
import FriendSearch from "./FriendSearch";
import FriendTabs from "./FriendTabs";
import FriendItem from "./FriendItem";

const FILTER_TABS = [
  { value: "all" as const, label: "전체" },
  { value: "favorite" as const, label: "즐겨찾기" },
];

// 헤더의 친구 아이콘에서 열리는 전역 친구 목록 패널입니다.
export default function FriendPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>(DUMMY_FRIENDS);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FriendFilter>("all");

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener("friend-panel-toggle", handleToggle);

    return () => {
      window.removeEventListener("friend-panel-toggle", handleToggle);
    };
  }, []);

  const handleToggleFavorite = (friendId: number) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.friendId === friendId
          ? { ...friend, isFavorite: !friend.isFavorite }
          : friend
      )
    );
  };

  const handleSelectFriend = () => {
    setIsOpen(false);
    window.dispatchEvent(new Event("chat-widget-toggle"));
  };

  const filteredFriends = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return friends
      .filter((friend) => {
        if (activeFilter === "favorite") return friend.isFavorite;
        return true;
      })
      .filter((friend) => {
        if (!keyword) return true;

        return (
          friend.nickname.toLowerCase().includes(keyword) ||
          friend.userId.toLowerCase().includes(keyword)
        );
      });
  }, [friends, searchValue, activeFilter]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[3900] bg-black/40"
        onClick={() => setIsOpen(false)}
      />

      <aside className="fixed inset-0 z-[3950] flex w-full flex-col bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-2xl">
        <div className="shrink-0 border-b border-[#E1E8EF] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0A1628]">친구 목록</h2>
              <p className="mt-0.5 text-xs text-[#8A9BB0]">
                전체 친구{" "}
                <span className="font-bold text-[#439A97]">
                  {friends.length}
                </span>
                명
              </p>
            </div>

            <button
              type="button"
              aria-label="닫기"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#F3F8FC]"
            >
              <Image src="/images/close.svg" alt="" width={16} height={16} />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <FriendSearch value={searchValue} onChange={setSearchValue} />
        </div>

        <FriendTabs
          items={FILTER_TABS}
          activeValue={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {friends.length === 0 ? (
            <EmptyState
              title="아직 등록된 친구가 없습니다."
              description="함께 여행을 공부할 친구를 추가해 보세요."
            />
          ) : filteredFriends.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다."
              description="다른 이름이나 아이디로 검색해 주세요."
            />
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <FriendItem
                  key={friend.friendId}
                  friend={friend}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={handleSelectFriend}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <Image
        src="/images/FriendIcon.svg"
        alt=""
        width={32}
        height={32}
        className="opacity-40"
      />
      <p className="mt-4 text-sm font-bold text-[#0A1628]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[#8A9BB0]">{description}</p>
      )}
    </div>
  );
}
