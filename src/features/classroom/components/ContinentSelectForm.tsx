"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import type { Continent } from "./types";

interface ContinentSelectFormProps {
  continents: Continent[];
  countryKeywordsByContinent?: Record<string, string[]>;
}

const continentStyle: Record<
  string,
  {
    label: string;
    code: string;
    accent: string;
    soft: string;
    description: string;
  }
> = {
  ASIA: {
    label: "Asia",
    code: "AS",
    accent: "bg-[#439A97]",
    soft: "bg-[#EEF8F7] text-[#357F7C]",
    description: "다양한 문화와 전통이 공존하는 대륙이에요.",
  },
  EUROPE: {
    label: "Europe",
    code: "EU",
    accent: "bg-[#4F7FD9]",
    soft: "bg-[#F0F5FF] text-[#416AB8]",
    description: "역사적인 도시와 예술이 살아있는 대륙이에요.",
  },
  NORTH_AMERICA: {
    label: "North America",
    code: "NA",
    accent: "bg-[#D6A640]",
    soft: "bg-[#FFF8E8] text-[#A87512]",
    description: "넓은 자연과 현대적인 도시가 어우러진 대륙이에요.",
  },
  SOUTH_AMERICA: {
    label: "South America",
    code: "SA",
    accent: "bg-[#D96A5B]",
    soft: "bg-[#FFF1EF] text-[#BC4F43]",
    description: "열정적인 문화와 풍부한 자연을 가진 대륙이에요.",
  },
  AFRICA: {
    label: "Africa",
    code: "AF",
    accent: "bg-[#C8843A]",
    soft: "bg-[#FFF4E8] text-[#A86425]",
    description: "광활한 대지와 독특한 생태계가 펼쳐진 대륙이에요.",
  },
  OCEANIA: {
    label: "Oceania",
    code: "OC",
    accent: "bg-[#7C6FD6]",
    soft: "bg-[#F3F1FF] text-[#6558C8]",
    description: "섬과 바다, 여유로운 자연이 매력적인 대륙이에요.",
  },
  ANTARCTICA: {
    label: "Antarctica",
    code: "AN",
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F1F5F9] text-[#64748B]",
    description: "얼음과 극지 환경으로 이루어진 특별한 대륙이에요.",
  },
};

const getContinentStyle = (continentCode: string) => {
  return (
    continentStyle[continentCode.toUpperCase()] ?? {
      label: continentCode,
      code: continentCode.slice(0, 2).toUpperCase(),
      accent: "bg-[#94A3B8]",
      soft: "bg-[#F8FAFC] text-[#64748B]",
      description: "여행에 필요한 강의를 확인해 보세요.",
    }
  );
};

export default function ContinentSelectForm({
  continents,
  countryKeywordsByContinent = {},
}: ContinentSelectFormProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const filteredContinents = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();

    if (!keyword) return continents;

    return continents.filter((continent) => {
      const continentCode = continent.continentCode.toUpperCase();
      const countryKeywords = countryKeywordsByContinent[continentCode] ?? [];

      return (
        continent.continentName.toLowerCase().includes(keyword) ||
        continent.continentCode.toLowerCase().includes(keyword) ||
        countryKeywords.some((countryName) =>
          countryName.toLowerCase().includes(keyword)
        )
      );
    });
  }, [continents, countryKeywordsByContinent, searchKeyword]);

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

      {continents.length === 0 ? (
        <div className="rounded-2xl border border-[#E3E8F0] bg-white p-8 text-center text-sm text-[#8A94A6]">
          대륙 데이터를 불러오지 못했습니다.
        </div>
      ) : filteredContinents.length === 0 ? (
        <div className="rounded-2xl border border-[#E3E8F0] bg-white p-8 text-center text-sm text-[#8A94A6]">
          검색 결과가 없습니다.
        </div>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {filteredContinents.map((item) => {
            const style = getContinentStyle(item.continentCode);

            return (
              <li key={item.continentCode}>
                <Link
                  href={`/classroom/${item.continentCode}`.toLowerCase()}
                  className="group relative block overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${style.accent}`}
                  />

                  <div className="relative grid min-h-[148px] grid-cols-[minmax(0,1fr)_116px]">
                    <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />
                    <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />

                    <div className="min-w-0 px-5 py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-sm font-bold ${style.soft}`}
                        >
                          {style.label}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h3 className="truncate text-xl font-bold text-[#0A1628]">
                          {item.continentName}
                        </h3>

                        <p className="mt-1 text-[13px] leading-5 text-[#718096]">
                          {style.description}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-5">
                        <div>
                          <p className="text-[9px] font-bold tracking-[0.14em] text-[#A0AEC0]">
                            COUNTRY
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#0A1628]">
                            {item.countryCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center border-l border-dashed border-[#D6E0E8] bg-[#FAFCFE] px-4 text-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.soft}`}
                      >
                        <span className="text-base font-black">
                          {style.code}
                        </span>
                      </div>

                      <p className="mt-2 text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                        강의실
                      </p>

                      <p className="text-sm font-black text-[#0A1628]">
                        입장
                      </p>

                      <span className="mt-2 text-xs font-semibold text-[#439A97] transition group-hover:translate-x-0.5">
                        학습하기 →
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}