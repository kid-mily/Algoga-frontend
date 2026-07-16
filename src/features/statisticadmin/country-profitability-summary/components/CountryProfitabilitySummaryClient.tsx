"use client";

import { useState } from "react";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import StatisticPeriodFilter from "@/features/statisticadmin/common/components/StatisticPeriodFilter";
import {
  countryProfitabilityItemsMock,
  countryProfitabilitySummaryMock,
} from "../mockData";
import CountryNetSalesBarChart from "./CountryNetSalesBarChart";
import CountryProfitabilitySummaryCards from "./CountryProfitabilitySummaryCards";
import CountryProfitabilityTable from "./CountryProfitabilityTable";
import CountryRefundCancelCompareChart from "./CountryRefundCancelCompareChart";

const periodOptions = [
  { label: "오늘", value: "TODAY" },
  { label: "이번주", value: "THIS_WEEK" },
  { label: "이번달", value: "THIS_MONTH" },
  { label: "올해", value: "THIS_YEAR" },
];

export default function CountryProfitabilitySummaryClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("THIS_MONTH");

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="flex items-start justify-between gap-4">
        <SimpleSubHeader
          title="나라별 수익성 종합"
          description="나라별 매출과 수익성을 비교해 운영 전략을 수립"
        />

        <StatisticPeriodFilter
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </section>

      <CountryProfitabilitySummaryCards summary={countryProfitabilitySummaryMock} />

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CountryNetSalesBarChart data={countryProfitabilityItemsMock} />
        <CountryRefundCancelCompareChart data={countryProfitabilityItemsMock} />
      </section>

      <CountryProfitabilityTable data={countryProfitabilityItemsMock} />
    </main>
  );
}
