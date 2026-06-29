"use client";

import { useMemo, useState } from "react";
import type { Continent } from "../components/types";

interface Params {
    continents: Continent[];
    countryKeywordsByContinent?: Record<string, string[]>;
}

export function useContinentSearch({
    continents,
    countryKeywordsByContinent = {},
}: Params) {
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

    return { searchInput, setSearchInput, filteredContinents, handleSearch };
}