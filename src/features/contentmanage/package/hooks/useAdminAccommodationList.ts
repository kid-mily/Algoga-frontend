"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteAccommodation,
  getCountryAccommodations,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { CourseCountry } from "@/features/contentmanage/lecture/types";
import { Accommodation } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useAdminAccommodationList = () => {
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [error, setError] = useState("");

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoadingCountries(true);
      setError("");
      const data = await getCourseCountries();
      setCountries(data);
      setSelectedCountryId((prev) => prev || String(data[0]?.countryId || ""));
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "국가 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoadingCountries(false);
    }
  }, []);

  const fetchAccommodations = useCallback(async () => {
    if (!selectedCountryId) {
      setAccommodations([]);
      return;
    }

    try {
      setIsLoadingAccommodations(true);
      setError("");
      const data = await getCountryAccommodations(selectedCountryId);
      setAccommodations(data);
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "숙소 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoadingAccommodations(false);
    }
  }, [selectedCountryId]);

  const removeAccommodation = useCallback(
    async (accommodationId: number) => {
      try {
        setError("");
        await deleteAccommodation(accommodationId);
        await fetchAccommodations();
        return true;
      } catch (deleteError: unknown) {
        setError(getErrorMessage(deleteError, "숙소 삭제에 실패했습니다."));
        return false;
      }
    },
    [fetchAccommodations]
  );

  useEffect(() => {
    queueMicrotask(() => {
      fetchCountries();
    });
  }, [fetchCountries]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchAccommodations();
    });
  }, [fetchAccommodations]);

  return {
    countries,
    selectedCountryId,
    accommodations,
    isLoading: isLoadingCountries || isLoadingAccommodations,
    error,
    setSelectedCountryId,
    removeAccommodation,
  };
};
