"use client";

import { useState } from "react";
import Image from "next/image";

import { searchUserByCode, sendFriendRequest } from "../friend.service";
import type { Friend } from "../friend.types";

interface FriendCodeSearchProps {
  myPersonalCode: string;
}

export default function FriendCodeSearch({ myPersonalCode }: FriendCodeSearchProps) {
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const isMe = Boolean(
    searchResult &&
      myPersonalCode &&
      searchResult.personalCode.toLowerCase() === myPersonalCode.toLowerCase()
  );

  const handleSearch = async () => {
    const nextCode = code.trim();

    if (!nextCode) {
      setNotice("개인 번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSearching(true);
      setNotice("");
      const result = await searchUserByCode(nextCode);
      setSearchResult(result);

      if (
        myPersonalCode &&
        result.personalCode.toLowerCase() === myPersonalCode.toLowerCase()
      ) {
        setNotice("본인은 친구로 추가할 수 없습니다.");
      }
    } catch (error) {
      setSearchResult(null);
      setNotice(error instanceof Error ? error.message : "사용자를 찾지 못했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult || isSending || isMe) return;

    try {
      setIsSending(true);
      setNotice("");
      await sendFriendRequest(searchResult.personalCode);
      setNotice("친구 요청을 보냈습니다.");
      setSearchResult(null);
      setCode("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "친구 요청을 보내지 못했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <article className="rounded-2xl border border-[#E5EDF5] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[#439A97]">
            ADD FRIEND
          </p>
          <h2 className="mt-1 text-sm font-bold text-[#0A1628]">
            개인 번호로 친구 추가
          </h2>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setNotice("");
            setSearchResult(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") void handleSearch();
          }}
          placeholder="친구의 개인 번호를 입력해 주세요"
          className="h-10 flex-1 rounded-2xl border border-[#E5EDF5] bg-[#F8FBFD] px-4 text-sm text-[#0A1628] outline-none transition placeholder:text-[#9AA6B6] focus:border-[#439A97] focus:bg-white"
        />

        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={isSearching}
          className="h-10 shrink-0 rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "검색 중" : "검색"}
        </button>
      </div>

      {searchResult && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#D7E9E7] bg-[#F7FBFB] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F5F4] text-sm font-bold text-[#357F7C]">
            {searchResult.profileImageUrl ? (
              <Image
                src={searchResult.profileImageUrl}
                alt={`${searchResult.nickname} 프로필`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              searchResult.nickname.slice(0, 1)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#0A1628]">
              {searchResult.nickname}
            </p>
            <p className="truncate text-xs text-[#8A9BB0]">
              @{searchResult.personalCode}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSendRequest()}
            disabled={isSending || isMe}
            className="h-9 shrink-0 rounded-xl bg-[#439A97] px-4 text-xs font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMe ? "본인 계정" : isSending ? "요청 중" : "친구 요청"}
          </button>
        </div>
      )}

      {notice && (
        <p className="mt-3 text-xs font-semibold text-[#439A97]">{notice}</p>
      )}

      <p className="mt-3 text-xs leading-5 text-[#8A9BB0]">
        친구를 추가하면 서로 연락하고 여행 일정을 함께 공유할 수 있어요.
      </p>
    </article>
  );
}
