"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteAdminPackage,
  getCountryAccommodations,
  getAdminPackages,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getErrorMessage } from "@/features/services/error.service";
import { TravelPackage } from "../types";

const shouldFillLabel = (value: string) => !value || value === "-";

const enrichPackageLabels = async (
  packages: TravelPackage[],
  signal?: AbortSignal
) => {
  if (packages.length === 0) return packages;

  const countries = await getCourseCountries(signal);
  if (signal?.aborted) return packages;

  const countryNameMap = new Map(
    countries.map((country) => [country.countryId, country.countryName])
  );
  const countryIds = Array.from(
    new Set(packages.map((item) => item.countryId).filter((countryId) => countryId > 0))
  );
  const accommodationGroups = await Promise.all(
    countryIds.map(async (countryId) => {
      const accommodations = await getCountryAccommodations(countryId, signal);

      return accommodations.map((accommodation) => [
        accommodation.accommodationId,
        accommodation.name,
      ] as const);
    })
  );

  if (signal?.aborted) return packages;

  const accommodationNameMap = new Map(accommodationGroups.flat());

  return packages.map((item) => ({
    ...item,
    countryName: shouldFillLabel(item.countryName)
      ? countryNameMap.get(item.countryId) ?? item.countryName
      : item.countryName,
    accommodationName: shouldFillLabel(item.accommodationName)
      ? accommodationNameMap.get(item.accommodationId) ?? item.accommodationName
      : item.accommodationName,
  }));
};

export const useAdminPackageList = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const fetchPackages = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestIdRef.current === requestId && !signal?.aborted;

    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminPackages(signal);
      if (!isCurrent()) return;
      const enrichedData = await enrichPackageLabels(data, signal);
      if (!isCurrent()) return;
      setPackages(enrichedData);
    } catch (fetchError: unknown) {
      if (!isCurrent()) return;
      setError(getErrorMessage(fetchError, "패키지 목록을 불러오지 못했습니다."));
      setPackages([]);
    } finally {
      if (!isCurrent()) return;
      setIsLoading(false);
    }
  }, []);

  const removePackage = useCallback(
    async (packageId: number) => {
      try {
        setError("");
        await deleteAdminPackage(packageId);
        await fetchPackages();
        return true;
      } catch (deleteError: unknown) {
        setError(getErrorMessage(deleteError, "패키지 삭제에 실패했습니다."));
        return false;
      }
    },
    [fetchPackages]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      void fetchPackages(controller.signal);
    });

    return () => {
      controller.abort();
    };
  }, [fetchPackages]);

  const filteredPackages = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return packages;

    return packages.filter((item) =>
      [
        item.name,
        item.countryName,
        item.accommodationName,
        item.departure,
        item.arrival,
        item.airline,
        item.flightNumber,
        String(item.packageId),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [packages, searchKeyword]);

  return {
    packages,
    filteredPackages,
    searchKeyword,
    totalCount: packages.length,
    isLoading,
    error,
    setSearchKeyword,
    removePackage,
  };
};
