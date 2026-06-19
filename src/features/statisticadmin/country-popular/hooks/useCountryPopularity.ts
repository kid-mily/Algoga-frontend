import { useCallback, useEffect, useMemo, useState } from "react";
import {
  downloadCountryStatisticsCsv,
  getCountryPopularityData,
} from "@/features/services/adminCountryStatistics.service";
import { CountryPopularityStat } from "../types";
import {
  formatCountryPopularityError,
  getDefaultCountryPopularityDateRange,
  getCountryPopularitySummary,
} from "../utils";

export const useCountryPopularity = () => {
  const defaultRange = useMemo(() => getDefaultCountryPopularityDateRange(), []);
  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [countries, setCountries] = useState<CountryPopularityStat[]>([]);
  const [topCountries, setTopCountries] = useState<CountryPopularityStat[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback((signal?: AbortSignal) => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getCountryPopularityData({
          from: fromDate,
          to: toDate,
          signal,
        });

        if (signal?.aborted) return;

        setCountries(data.countries);
        setTopCountries(data.topCountries);
      } catch (loadError: unknown) {
        if (signal?.aborted) return;

        setError(
          formatCountryPopularityError(
            loadError,
            "나라별 인기도 데이터를 불러오지 못했습니다."
          )
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();
  }, [fromDate, toDate]);

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal);

    return () => {
      controller.abort();
    };
  }, [load]);

  const filteredCountries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return countries;

    return countries.filter((country) =>
      [country.countryName, String(country.countryId)]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [countries, searchKeyword]);

  const summary = useMemo(
    () => getCountryPopularitySummary(countries),
    [countries]
  );

  const handleCsvDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      setError("");

      const blob = await downloadCountryStatisticsCsv({
        from: fromDate,
        to: toDate,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "country-statistics.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError: unknown) {
      setError(
        formatCountryPopularityError(
          downloadError,
          "나라별 통계 CSV를 다운로드하지 못했습니다."
        )
      );
    } finally {
      setIsDownloading(false);
    }
  }, [fromDate, toDate]);

  const handleFromDateChange = useCallback((value: string) => {
    setFromDate(value);
    setToDate((currentToDate) =>
      currentToDate && value > currentToDate ? value : currentToDate
    );
  }, []);

  const handleToDateChange = useCallback((value: string) => {
    setToDate(value);
    setFromDate((currentFromDate) =>
      currentFromDate && value < currentFromDate ? value : currentFromDate
    );
  }, []);

  return {
    fromDate,
    toDate,
    countries,
    filteredCountries,
    topCountries,
    summary,
    searchKeyword,
    isLoading,
    isDownloading,
    error,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
    setSearchKeyword,
    downloadCsv: handleCsvDownload,
  };
};
