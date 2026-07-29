"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getFriends, toggleFriendFavorite } from "../friend.service";
import { filterFriendsByKeyword } from "../friend.util";
import type { Friend, FriendFilter } from "../friend.types";
import FriendItem from "./FriendItem";
import FriendSearch from "./FriendSearch";
import FriendTabs from "./FriendTabs";

const FILTER_TABS = [
  { value: "all" as const, label: "전체" },
  { value: "favorite" as const, label: "즐겨찾기" },
];

const getFriendErrorMessage = (error: unknown) => {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return "친구 목록을 확인하려면 로그인이 필요합니다.";
    }

    return error.message;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return "";
  }

  return "친구 목록을 불러오지 못했습니다.";
};

export default function FriendPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FriendFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((previous) => !previous);
    };

    window.addEventListener("friend-panel-toggle", handleToggle);

    return () => {
      window.removeEventListener(
        "friend-panel-toggle",
        handleToggle
      );
    };
  }, []);

  const fetchFriends = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextFriends = await getFriends(signal);
        setFriends(nextFriends);
      } catch (error) {
        const message = getFriendErrorMessage(error);

        if (message) {
          setErrorMessage(message);
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    void fetchFriends(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isOpen, fetchFriends]);

  const handleToggleFavorite = async (
    relationId: number
  ) => {
    const targetFriend = friends.find((friend) =>
      friend.relationId === relationId
    );
    
    if (!targetFriend) return;
    
    const previousFavorite = targetFriend.isFavorite;
    
    setFriends((previous) => 
      previous.map((friend) =>
        friend.relationId === relationId ? {
          ...friend,
          isFavorite:
          !previousFavorite,
        }
        : friend
      )
    );
    
    try {
      await toggleFriendFavorite(relationId);
    } catch (error) {
      setFriends((previous) =>
        previous.map((friend) =>
          friend.relationId === relationId ? {
            ...friend,
            isFavorite:
            previousFavorite,
          }
          : friend
        )
      );

      setErrorMessage(error instanceof Error ? error.message : "즐겨찾기 상태를 변경하지 못했습니다.");
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    setIsOpen(false);

    window.dispatchEvent(
      new CustomEvent("chat-widget-open-friend", {
        detail: {
          userId: friend.userId,
          nickname: friend.nickname,
          profileImageUrl: friend.profileImageUrl,
        },
      })
    );
  };

  const filteredFriends = useMemo(() => {
    const byFilter =
      activeFilter === "favorite"
        ? friends.filter((friend) => friend.isFavorite)
        : friends;

    return filterFriendsByKeyword(byFilter, searchValue);
  }, [friends, searchValue, activeFilter]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[3900] bg-black/40"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        aria-label="친구 목록"
        className="fixed inset-0 z-[3950] flex w-full flex-col bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-2xl"
      >
        <div className="shrink-0 border-b border-[#E1E8EF] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0A1628]">
                친구 목록
              </h2>

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
              aria-label="친구 목록 닫기"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#F3F8FC]"
            >
              <Image
                src="/images/close.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <FriendSearch
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        <FriendTabs
          items={FILTER_TABS}
          activeValue={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <div
              role="status"
              className="flex flex-col items-center px-6 py-16 text-center"
            >
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#DCE7ED] border-t-[#439A97]" />

              <p className="mt-4 text-sm text-[#8A9BB0]">
                친구 목록을 불러오는 중입니다.
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <Image
                src="/images/FriendIcon.svg"
                alt=""
                width={32}
                height={32}
                className="opacity-40"
              />

              <p className="mt-4 text-sm font-bold text-[#0A1628]">
                친구 목록을 불러오지 못했습니다.
              </p>

              <p className="mt-1 text-xs text-[#8A9BB0]">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => void fetchFriends()}
                className="mt-5 rounded-lg bg-[#439A97] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#357F7C]"
              >
                다시 시도
              </button>
            </div>
          ) : friends.length === 0 ? (
            <EmptyState
              title="아직 등록된 친구가 없습니다."
              description="함께 여행하고 공부할 친구를 추가해 보세요."
            />
          ) : filteredFriends.length === 0 ? (
            searchValue.trim() ? (
              <EmptyState
                title="검색 결과가 없습니다."
                description="다른 닉네임이나 개인 코드로 검색해 주세요."
              />
            ) : activeFilter === "favorite" ? (
              <EmptyState
                title="즐겨찾기에 지정한 친구가 없습니다."
                description="친구 목록에서 별 아이콘을 눌러 즐겨찾기에 추가해 보세요."
              />
            ) : (
              <EmptyState
                title="표시할 친구가 없습니다."
                description="친구를 추가한 후 다시 확인해 주세요."
              />
            )
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <FriendItem
                  key={friend.relationId}
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

      <p className="mt-4 text-sm font-bold text-[#0A1628]">
        {title}
      </p>

      {description && (
        <p className="mt-1 text-xs text-[#8A9BB0]">
          {description}
        </p>
      )}
    </div>
  );
}