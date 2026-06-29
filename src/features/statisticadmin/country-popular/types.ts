export type CountryPopularityStat = {
  countryId: number;
  countryName: string;
  countryCode: string;
  signupCount: number;
  bookingCount: number;
  revenue: number;
  shareRate: number;
  rank: number;
};

export type CountryPopularitySummary = {
  totalCountryCount: number;
  totalSignupCount: number;
  totalBookingCount: number;
  totalRevenue: number;
  averageShareRate: number;
};

export type CountryPopularityData = {
  bookingTop10: CountryPopularityStat[];
  revenueTop10: CountryPopularityStat[];
};
