"use client";

import { useEffect, useState } from "react";
import { Country } from "@/features/classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";
import { continent_code_map } from "../constants/mapConstants";

export function useContinentCountries(selectedContinent: string) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!selectedContinent) {
            setCountries([]);
            setErrorMessage("");
            setIsLoading(false);
            return;
        }

        const continentCode = continent_code_map[selectedContinent];

        if (!continentCode) {
            setCountries([]);
            setErrorMessage("지원하지 않는 대륙입니다.");
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadCountries = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const countryList = await getCountries(
                    continentCode,
                    controller.signal
                );

                setCountries(countryList);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("[map] 국가 목록 조회 실패:", error);
                setCountries([]);
                setErrorMessage("국가 데이터를 불러오지 못했습니다.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void loadCountries();

        return () => {
            controller.abort();
        };
    }, [selectedContinent]);

    return {
        countries,
        isLoading,
        errorMessage,
    };
}