export type LectureConversionPeriod = "today" | "thisWeek" | "thisMonth" | "thisYear";

export type LectureConversionQuery = {
  from: string;
  to: string;
};

export type LectureReservationSummary = {
  totalLectureBuyers: number;
  completionRate: number;
  completedToReservationRate: number;
  completedVsIncompleteMultiplier: number;
};

export type LectureConversionFunnelStep = {
  key: "buyers" | "completed" | "reserved";
  label: string;
  value: number;
  percentage: number;
  caption: string;
  tone: "teal" | "purple" | "orange";
};

export type LectureConversionRanking = {
  lectureTitle: string;
  conversionRate: number;
};

export type CountryLectureConversion = {
  country: string;
  lectureBuyers: number;
  completedUsers: number;
  reservationUsers: number;
  conversionRate: number;
  evaluation: "우수" | "보통" | "저조";
};

export type CourseReservationConversionData = {
  summary: LectureReservationSummary;
  funnel: LectureConversionFunnelStep[];
  topLectures: LectureConversionRanking[];
  bottomLectures: LectureConversionRanking[];
  countries: CountryLectureConversion[];
};
