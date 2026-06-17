"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteAccommodation,
  getCountryAccommodations,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getErrorMessage } from "@/features/services/error.service";
import { Accommodation, CourseCountry } from "../types";

export const useAdminAccommodationList = () => {
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [error, setError] = useState("");
  const countriesRequestIdRef = useRef(0);
  const accommodationsRequestIdRef = useRef(0);

  const fetchCountries = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++countriesRequestIdRef.current;
    const isCurrent = () =>
      countriesRequestIdRef.current === requestId && !signal?.aborted;

    try {
      setIsLoadingCountries(true);
      setError("");
      const data = await getCourseCountries(signal);
      if (!isCurrent()) return;
      setCountries(data);
      setSelectedCountryId((prev) => prev || String(data[0]?.countryId || ""));
    } catch (fetchError: unknown) {
      if (!isCurrent()) return;
      setError(getErrorMessage(fetchError, "국가 목록을 불러오지 못했습니다."));
    } finally {
      if (!isCurrent()) return;
      setIsLoadingCountries(false);
    }
  }, []);

  const fetchAccommodations = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++accommodationsRequestIdRef.current;
    const isCurrent = () =>
      accommodationsRequestIdRef.current === requestId && !signal?.aborted;

    if (!selectedCountryId) {
      if (!isCurrent()) return;
      setAccommodations([]);
      return;
    }

    try {
      setIsLoadingAccommodations(true);
      setError("");
      const data = await getCountryAccommodations(selectedCountryId, signal);
      if (!isCurrent()) return;
      setAccommodations(data);
    } catch (fetchError: unknown) {
      if (!isCurrent()) return;
      setError(getErrorMessage(fetchError, "숙소 목록을 불러오지 못했습니다."));
    } finally {
      if (!isCurrent()) return;
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
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      void fetchCountries(controller.signal);
    });

    return () => {
      controller.abort();
    };
  }, [fetchCountries]);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      void fetchAccommodations(controller.signal);
    });

    return () => {
      controller.abort();
    };
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
