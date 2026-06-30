"use client";

import { useMemo, useState } from "react";
import CountryCard from "./CountryCard";
import SearchBar from "./SearchBar";
import type { Country } from "./types";
import type { CountryTicketStyle } from "./CountrySelectSection";

type CountrySearchClientProps = {
  countries: Country[];
  errorMessage?: string;
  continentCode: string;
  ticketStyle: CountryTicketStyle;
};

export default function CountrySearchClient({
  countries,
  errorMessage = "",
  continentCode,
  ticketStyle,
}: CountrySearchClientProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

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
    <>
      <div className="mb-5 w-full sm:max-w-sm">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />
      </div>

      {errorMessage ? (
        <EmptyState message={errorMessage} tone="error" />
      ) : countries.length === 0 ? (
        <EmptyState message="등록된 국가가 없습니다." />
      ) : filteredCountries.length === 0 ? (
        <EmptyState message="검색 결과가 없습니다." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.countryCode}
              country={country}
              continentCode={continentCode}
              ticketStyle={ticketStyle}
            />
          ))}
        </ul>
      )}
    </>
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