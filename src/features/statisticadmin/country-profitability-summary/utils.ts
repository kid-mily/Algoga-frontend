export const formatPercent = (value: number) => {
    return `${value.toLocaleString()}%`;
};

export const formatManwon = (value: number) => {
  return `${Math.round(value / 10000).toLocaleString()}만원`;
};

export const formatBookingCount = (value: number) => {
  return value.toLocaleString();
};

export const getRateTextColor = (value: number) => {
  if (value >= 6) return "text-[#EF4444]";
  if (value >= 5) return "text-[#F59E0B]";
  return "text-[#667085]";
};

export const countryProfitPeriods = [
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "THIS_YEAR",
] as const;

export type CountryProfitPeriod = (typeof countryProfitPeriods)[number];

export const countryProfitPeriodLabels: Record<CountryProfitPeriod, string> = {
  TODAY: "오늘",
  THIS_WEEK: "이번주",
  THIS_MONTH: "이번달",
  THIS_YEAR: "올해",
};

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

export const getCountryProfitDateRange = (period: CountryProfitPeriod) => {
  const now = new Date();
  const from = new Date(now);

  if (period === "TODAY") {
    return { from: toDateInputValue(now), to: toDateInputValue(now) };
  }

  if (period === "THIS_WEEK") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + mondayOffset);
  }

  if (period === "THIS_MONTH") {
    from.setDate(1);
  }

  if (period === "THIS_YEAR") {
    from.setMonth(0, 1);
  }

  return { from: toDateInputValue(from), to: toDateInputValue(now) };
};
