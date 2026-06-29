import { getErrorMessage } from "@/features/services/error.service";
import { CountryPopularityStat, CountryPopularitySummary } from "./types";

export const formatCountryPopularityError = (
  error: unknown,
  fallbackMessage: string
) => getErrorMessage(error, fallbackMessage);

export const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("ko-KR");

export const formatWon = (value: number) =>
  `${formatNumber(value)}원`;

export const formatPercent = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultCountryPopularityDateRange = () => {
  const to = new Date();
  const from = new Date();

  from.setDate(to.getDate() - 29);

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
};

export const getCountryPopularitySummary = (
  countries: CountryPopularityStat[]
): CountryPopularitySummary => {
  const totalSignupCount = countries.reduce(
    (sum, country) => sum + country.signupCount,
    0
  );
  const totalBookingCount = countries.reduce(
    (sum, country) => sum + country.bookingCount,
    0
  );
  const totalRevenue = countries.reduce(
    (sum, country) => sum + country.revenue,
    0
  );
  const averageShareRate =
    countries.length > 0
      ? countries.reduce((sum, country) => sum + country.shareRate, 0) /
        countries.length
      : 0;

  return {
    totalCountryCount: countries.length,
    totalSignupCount,
    totalBookingCount,
    totalRevenue,
    averageShareRate,
  };
};
