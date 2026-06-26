export type CountryPopularityStat = {
  countryId: number;
  countryName: string;
  viewCount: number;
  bookingCount: number;
  revenueAmount: number;
  popularityScore: number;
  conversionRate: number;
  rank: number;
};

export type CountryPopularitySummary = {
  totalCountryCount: number;
  totalViewCount: number;
  totalBookingCount: number;
  totalRevenueAmount: number;
  averageConversionRate: number;
};

export type CountryPopularityData = {
  countries: CountryPopularityStat[];
  topCountries: CountryPopularityStat[];
};
