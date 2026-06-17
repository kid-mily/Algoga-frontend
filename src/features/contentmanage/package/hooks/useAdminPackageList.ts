"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteAdminPackage,
  getAdminPackages,
} from "@/features/services/adminPackage.service";
import { TravelPackage } from "../types";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

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
      setPackages(data);
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
