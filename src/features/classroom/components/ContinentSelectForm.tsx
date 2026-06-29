"use client";

import SearchBar from "./SearchBar";
import ContinentEmptyState from "./ContinentEmptyState";
import ContinentTicketCard from "./ContinentTicketCard";
import { useContinentSearch } from "../hooks/useContinentSearch";
import type { Continent } from "./types";

interface Props {
  continents: Continent[];
}

export default function ContinentSelectForm({ continents }: Props) {
  const {
    searchInput,
    setSearchInput,
    filteredContinents,
    isSearching,
    handleSearch,
  } = useContinentSearch({ continents });

  return (
    <section aria-labelledby="continent-select-title" className="w-full">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#439A97]">
            SELECT DESTINATION
          </p>

          <h2
            id="continent-select-title"
            className="mt-1 text-2xl font-bold text-[#0A1628]"
          >
            대륙별 여행 강의
          </h2>

          <p className="mt-1 text-sm text-[#8A94A6]">
            대륙명이나 나라 이름을 검색해 원하는 여행지를 찾아보세요.
          </p>
        </div>

        <div className="w-full sm:max-w-sm">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {isSearching ? (
        <ContinentEmptyState message="나라 정보를 검색하는 중입니다." />
      ) : continents.length === 0 ? (
        <ContinentEmptyState message="대륙 데이터를 불러오지 못했습니다." />
      ) : filteredContinents.length === 0 ? (
        <ContinentEmptyState message="검색 결과가 없습니다." />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {filteredContinents.map((continent) => (
            <li key={continent.continentCode}>
              <ContinentTicketCard continent={continent} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}