export type InterestPeriod = "today" | "week" | "month" | "year";

export type InterestQuery = {
  from: string;
  to: string;
};

export type InterestSummary = {
  totalEnrollmentCount: number;
  averageCompletionRate: number;
  riskyCourseCount: number;
};

export type CountryInterestItem = {
  countryName: string;
  enrollmentCount: number;
};

export type CourseInterestItem = {
  courseTitle: string;
  enrollmentCount: number;
};

export type CountryDetailStat = {
  rank: number;
  countryName: string;
  bookingCount: number;
  grossRevenue: number;
  netRevenue: number;
  refundRate: number;
  balanceConversionRate: number;
  cancelRate: number;
  share: number;
};

export type CompletionStatus = "NORMAL" | "WARNING" | "RISK";

export type CourseCompletionStat = {
  courseId: number;
  courseTitle: string;
  countryName: string;
  enrollmentCount: number;
  averageProgressRate: number;
  completionRate: number;
  averageWatchHours: number;
  completionStatus: CompletionStatus;
};

export type PopularCountryCourseRank = {
  rank: number;
  courseTitle: string;
  countryName: string;
  enrollmentCount: number;
  averageProgressRate: number;
  completionRate: number;
  completionStatus: CompletionStatus;
};

export type CountryCourseInterestData = {
  summary: InterestSummary;
  countries: CountryInterestItem[];
  courses: CourseInterestItem[];
  countryDetails: CountryDetailStat[];
  courseCompletions: CourseCompletionStat[];
  popularCourseRanks: PopularCountryCourseRank[];
};
