"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Country } from "./types";

interface CountrySelectSectionProps {
  countries?: Country[];
}

export default function CountrySelectSection({
  countries = [],
}: CountrySelectSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const filteredCountries = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();

    if (!keyword) {
      return countries;
    }

    return countries.filter((country) =>
      country.countryName.toLowerCase().includes(keyword)
    );
  }, [countries, searchKeyword]);

  return (
    <section aria-labelledby="country-select-title" className="p-5">
      <h2 id="country-select-title" className="sr-only">
        국가 선택
      </h2>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
      />

      {countries.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
          등록된 국가가 없습니다.
        </p>
      ) : filteredCountries.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="mt-8 grid w-full grid-cols-4 gap-10">
          {filteredCountries.map((country) => {
            const href =
              `/classroom/${country.continentCode}/${country.countryId}`.toLowerCase();

            return (
              <li key={country.countryCode}>
                <Link
                  href={href}
                  className="flex h-48 w-52 flex-col justify-center rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold text-[#0A1628]">
                    {country.countryName}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#8A94A6]">
                    {country.courseCount}개 강의
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}