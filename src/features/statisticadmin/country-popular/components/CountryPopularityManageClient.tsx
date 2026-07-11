"use client";

import { useMemo, useState } from "react";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { CountryPopularityStat } from "../types";
import {
  formatNumber,
  formatPercent,
  formatWon,
  getCountryPopularitySummary,
  getDefaultCountryPopularityDateRange,
} from "../utils";
import CountryPopularitySummaryCards from "./CountryPopularitySummaryCards";
import CountryPopularityTable from "./CountryPopularityTable";
import CountryPopularityTopChart from "./CountryPopularityTopChart";
import CountryPopularityToolbar from "./CountryPopularityToolbar";

const EMPTY_COUNTRIES: CountryPopularityStat[] = [];

export default function CountryPopularityManageClient() {
  const defaultRange = useMemo(() => getDefaultCountryPopularityDateRange(), []);
  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredCountries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return EMPTY_COUNTRIES;

    return EMPTY_COUNTRIES.filter((country) =>
      [country.countryName, String(country.countryId)]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchKeyword]);

  const summary = useMemo(
    () => getCountryPopularitySummary(EMPTY_COUNTRIES),
    []
  );

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    setToDate((currentToDate) =>
      currentToDate && value > currentToDate ? value : currentToDate
    );
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    setFromDate((currentFromDate) =>
      currentFromDate && value < currentFromDate ? value : currentFromDate
    );
  };

  return (
    <main aria-label="나라별 인기도">
      <SimpleSubHeader
        title="나라별 인기도"
        description={`국가 ${formatNumber(summary.totalCountryCount)}개 | 가입 ${formatNumber(summary.totalSignupCount)}명 | 예약 ${formatNumber(summary.totalBookingCount)}건 | 평균 점유율 ${formatPercent(summary.averageShareRate)}`}
      />

      <CountryPopularitySummaryCards summary={summary} />

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <CountryPopularityTopChart
          title="매출 Top 10"
          countries={EMPTY_COUNTRIES}
          metric="revenue"
        />

        <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5">
          <h2 className="text-[16px] font-bold text-[#111827]">요약</h2>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">총 매출</dt>
              <dd className="font-bold text-[#111827]">
                {formatWon(summary.totalRevenue)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">평균 점유율</dt>
              <dd className="font-bold text-[#111827]">
                {formatPercent(summary.averageShareRate)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#667085]">예약 완료</dt>
              <dd className="font-bold text-[#111827]">
                {formatNumber(summary.totalBookingCount)}건
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <CountryPopularityToolbar
        fromDate={fromDate}
        toDate={toDate}
        searchKeyword={searchKeyword}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onSearchKeywordChange={setSearchKeyword}
      />

      <CountryPopularityTable countries={filteredCountries} />
    </main>
  );
}

