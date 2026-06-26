"use client";

import { useEffect, useState } from "react";
import  { Country } from "@/features/classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";
import { CONTINENT_CODE_MAP } from "../constants/mapConstants";

export function useContinentCountries(selectedContinent: string) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!selectedContinent) {
        setCountries([]);
        setErrorMessage("");
        return;
        }

        const continentCode = CONTINENT_CODE_MAP[selectedContinent];

        if (!continentCode) {
        setCountries([]);
        setErrorMessage("지원하지 않는 대륙입니다.");
        return;
        }

        let active = true;

        const loadCountries = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const countryList = await getCountries(continentCode);

            if (!active) return;

            setCountries(Array.isArray(countryList) ? countryList : []);
        } catch (error) {
            if (!active) return;

            console.error("[map] 국가 목록 조회 실패:", error);
            setCountries([]);
            setErrorMessage("국가 정보를 불러오지 못했습니다.");
        } finally {
            if (active) {
            setIsLoading(false);
            }
        }
        };

        void loadCountries();

        return () => {
        active = false;
        };
    }, [selectedContinent]);

    return {
        countries,
        isLoading,
        errorMessage,
    };
}