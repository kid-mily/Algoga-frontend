"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Continent } from "../components/types";
import { getCountryKeywordsByContinent } from "../../services/countryKeywordSearch.service";

interface Params {
  continents: Continent[];
}

const normalizeKeyword = (value: string) => value.trim().toLowerCase();

const getContinentCode = (continent: Continent) =>
  continent.continentCode.toUpperCase();

const filterByContinent = (continents: Continent[], keyword: string) => {
  if (!keyword) return continents;

  return continents.filter((continent) => {
    return (
      continent.continentName.toLowerCase().includes(keyword) ||
      continent.continentCode.toLowerCase().includes(keyword)
    );
  });
};

const filterByCountryKeyword = (
  continents: Continent[],
  keyword: string,
  countryKeywordsByContinent: Record<string, string[]>
) => {
  if (!keyword) return continents;

  return continents.filter((continent) => {
    const continentCode = getContinentCode(continent);
    const countryKeywords = countryKeywordsByContinent[continentCode] ?? [];

    return (
      continent.continentName.toLowerCase().includes(keyword) ||
      continent.continentCode.toLowerCase().includes(keyword) ||
      countryKeywords.some((countryName) =>
        countryName.toLowerCase().includes(keyword)
      )
    );
  });
};

export function useContinentSearch({ continents }: Params) {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredContinents, setFilteredContinents] = useState(continents);
  const [isSearching, setIsSearching] = useState(false);

  const latestSearchIdRef = useRef(0);

  useEffect(() => {
    setFilteredContinents(continents);
  }, [continents]);

  const continentOnlyResult = useMemo(() => {
    const keyword = normalizeKeyword(searchKeyword);
    return filterByContinent(continents, keyword);
  }, [continents, searchKeyword]);

  const handleSearch = async () => {
    const keyword = normalizeKeyword(searchInput);
    const searchId = latestSearchIdRef.current + 1;

    latestSearchIdRef.current = searchId;
    setSearchKeyword(searchInput.trim());

    if (!keyword) {
      setFilteredContinents(continents);
      return;
    }

    const directContinentMatches = filterByContinent(continents, keyword);

    if (directContinentMatches.length > 0) {
      setFilteredContinents(directContinentMatches);
      return;
    }

    setIsSearching(true);

    try {
      const countryKeywordsByContinent =
        await getCountryKeywordsByContinent(continents);

      if (latestSearchIdRef.current !== searchId) {
        return;
      }

      setFilteredContinents(
        filterByCountryKeyword(
          continents,
          keyword,
          countryKeywordsByContinent
        )
      );
    } finally {
      if (latestSearchIdRef.current === searchId) {
        setIsSearching(false);
      }
    }
  };

  return {
    searchInput,
    setSearchInput,
    searchKeyword,
    filteredContinents:
      searchKeyword && continentOnlyResult.length > 0
        ? continentOnlyResult
        : filteredContinents,
    isSearching,
    handleSearch,
  };
}
