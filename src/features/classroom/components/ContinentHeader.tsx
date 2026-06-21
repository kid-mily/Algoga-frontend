"use client";

import { useState } from "react";
import Image from "next/image";
import SearchBar from "./SearchBar";

export default function ContinentHeader() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    const keyword = searchValue.trim();

    if (!keyword) return;

    console.log("검색어:", keyword);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12">
      {/* 상단 안내 */}
      <div className="mt-3 mb-10 flex flex-col items-center gap-5 text-center">
        <Image
          src="/images/Earth.svg"
          alt="지구"
          width={120}
          height={120}
          priority
        />

        <h1 className="text-4xl font-bold text-[#0A1628]">
          어디로 떠나시나요?
        </h1>

        <p className="text-lg text-[#8A9BB0]">
          대륙을 선택하여 여행을 시작하세요
        </p>
      </div>

      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
      />
    </div>
  );
}