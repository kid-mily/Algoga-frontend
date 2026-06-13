"use client";

import { useEffect, useRef, useState } from "react";
import { searchFlights } from "@/features/services/adminPackage.service";
import { Flight, FlightSearchParams } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const isAbortError = (error: unknown) => {
  return error instanceof DOMException && error.name === "AbortError";
};

export const useFlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const submitSearch = async (params: FlightSearchParams) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setIsSearching(true);
      setError("");
      const data = await searchFlights(params, controller.signal);
      if (controller.signal.aborted) return;
      setFlights(data);
    } catch (searchError: unknown) {
      if (isAbortError(searchError) || controller.signal.aborted) return;
      setError(getErrorMessage(searchError, "항공편 검색에 실패했습니다."));
      setFlights([]);
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    flights,
    isSearching,
    error,
    submitSearch,
  };
};
