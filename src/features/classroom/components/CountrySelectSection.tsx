"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import type { Country } from "./types";

interface CountrySelectSectionProps {
  countries?: Country[];
  errorMessage?: string;
  continentCode: string;
}

const CONTINENT_NAMES: Record<string, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};

const continentTicketStyle: Record<
  string,
  {
    accent: string;
    soft: string;
    text: string;
  }
> = {
  ASIA: {
    accent: "bg-[#439A97]",
    soft: "bg-[#EEF8F7]",
    text: "text-[#357F7C]",
  },
  EUROPE: {
    accent: "bg-[#4F7FD9]",
    soft: "bg-[#F0F5FF]",
    text: "text-[#416AB8]",
  },
  NORTH_AMERICA: {
    accent: "bg-[#D6A640]",
    soft: "bg-[#FFF8E8]",
    text: "text-[#A87512]",
  },
  SOUTH_AMERICA: {
    accent: "bg-[#D96A5B]",
    soft: "bg-[#FFF1EF]",
    text: "text-[#BC4F43]",
  },
  AFRICA: {
    accent: "bg-[#C8843A]",
    soft: "bg-[#FFF4E8]",
    text: "text-[#A86425]",
  },
  OCEANIA: {
    accent: "bg-[#7C6FD6]",
    soft: "bg-[#F3F1FF]",
    text: "text-[#6558C8]",
  },
  ANTARCTICA: {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
  },
};

const getTicketStyle = (continentCode: string) => {
  return (
    continentTicketStyle[continentCode.toUpperCase()] ?? {
      accent: "bg-[#94A3B8]",
      soft: "bg-[#F8FAFC]",
      text: "text-[#64748B]",
    }
  );
};

const getContinentName = (continentCode: string) => {
  return CONTINENT_NAMES[continentCode.toUpperCase()] ?? continentCode;
};

export default function CountrySelectSection({
  countries = [],
  errorMessage = "",
  continentCode,
}: CountrySelectSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const style = getTicketStyle(continentCode);
  const continentName = getContinentName(continentCode);

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const filteredCountries = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();

    if (!keyword) return countries;

    return countries.filter((country) =>
      country.countryName.toLowerCase().includes(keyword)
    );
  }, [countries, searchKeyword]);

  return (
    <section aria-labelledby="country-select-title" className="w-full">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className={`text-sm font-semibold tracking-[0.16em] ${style.text}`}>
            COUNTRY
          </p>

          <h2
            id="country-select-title"
            className="mt-1 text-2xl font-bold text-[#0A1628]"
          >
            {continentName}
          </h2>

          <p className="mt-1 text-sm text-[#8A94A6]">
            나라 이름을 검색하거나 티켓을 선택해 국가별 강의실로 이동하세요.
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

      {errorMessage ? (
        <EmptyState message={errorMessage} tone="error" />
      ) : countries.length === 0 ? (
        <EmptyState message="등록된 국가가 없습니다." />
      ) : filteredCountries.length === 0 ? (
        <EmptyState message="검색 결과가 없습니다." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country) => {
            const href =
              `/classroom/${country.continentCode}/${country.countryId}`.toLowerCase();

            return (
              <li key={country.countryCode}>
                <Link
                  href={href}
                  className="group relative block overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${style.accent}`}
                  />

                  <div className="relative min-h-[142px] px-5 py-4 pl-6">
                    <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />
                    <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                        CLASS
                      </span>
                    </div>

                    <h3 className="mt-4 truncate text-xl font-bold text-[#0A1628]">
                      {country.countryName}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#718096]">
                      {country.courseCount}개 강의
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-3">
                      <span className="text-[9px] font-bold tracking-[0.14em] text-[#A0AEC0]">
                        강의실
                      </span>

                      <span
                        className={`text-xs font-semibold transition group-hover:translate-x-0.5 ${style.text}`}
                      >
                        입장하기 →
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

function EmptyState({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-8 text-center text-sm ${
        tone === "error"
          ? "border-red-100 text-red-500"
          : "border-[#E3E8F0] text-[#8A94A6]"
      }`}
    >
      {message}
    </div>
  );
}