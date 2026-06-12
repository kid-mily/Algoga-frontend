"use client";

import { useState } from "react";
import { searchFlights } from "@/features/services/adminPackage.service";
import { Flight, FlightSearchParams } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useFlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const submitSearch = async (params: FlightSearchParams) => {
    try {
      setIsSearching(true);
      setError("");
      const data = await searchFlights(params);
      setFlights(data);
    } catch (searchError: unknown) {
      setError(getErrorMessage(searchError, "항공편 검색에 실패했습니다."));
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    flights,
    isSearching,
    error,
    submitSearch,
  };
};
