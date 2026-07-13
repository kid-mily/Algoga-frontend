"use client";

import { useState } from "react";

interface FriendCodeSearchProps {
  friendCount: number;
}

export default function FriendCodeSearch({ friendCount }: FriendCodeSearchProps) {
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");

  const handleSearch = () => {
    if (!code.trim()) {
      setNotice("개인 번호를 입력해 주세요.");
      return;
    }

    setNotice("친구 검색 기능은 아직 준비 중입니다.");
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
          }}
          placeholder="친구의 개인 번호를 입력해 주세요"
          className="h-10 flex-1 rounded-2xl border border-[#E5EDF5] bg-[#F8FBFD] px-4 text-sm text-[#0A1628] outline-none transition placeholder:text-[#9AA6B6] focus:border-[#439A97] focus:bg-white"
        />

        <button
          type="button"
          onClick={handleSearch}
          className="h-10 shrink-0 rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white transition hover:bg-[#357F7C]"
        >
          검색
        </button>
      </div>

      {notice && (
        <p className="mt-3 text-xs font-semibold text-[#439A97]">{notice}</p>
      )}

      <p className="mt-3 text-xs leading-5 text-[#8A9BB0]">
        친구를 추가하면 서로 연락하고 여행 일정을 함께 공유할 수 있어요.
      </p>
    </article>
  );
}