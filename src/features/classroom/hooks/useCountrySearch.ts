"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Country } from "../components/types";

interface Params {
    countries: Country[];
}

export function useCountrySearch({ countries }: Params) {
    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const deferredKeyword = useDeferredValue(searchKeyword);

    const handleSearch = () => {
        setSearchKeyword(searchInput.trim());
    };

    const filteredCountries = useMemo(() => {
        const keyword = deferredKeyword.toLowerCase();

        if (!keyword) return countries;

        return countries.filter((country) =>
        country.countryName.toLowerCase().includes(keyword)
        );
    }, [countries, deferredKeyword]);

    return {
        searchInput,
        setSearchInput,
        filteredCountries,
        handleSearch,
    };
}