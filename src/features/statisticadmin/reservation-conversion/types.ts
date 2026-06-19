export type ConversionSummary = {
  attemptCount: number;
  completedCount: number;
  conversionRate: number;
};

export type DailyConversionStat = {
  date: string;
  attemptCount: number;
  completedCount: number;
  conversionRate: number;
};

export type ProductConversionStat = {
  accommodationId: number;
  productName: string;
  attemptCount: number;
  completedCount: number;
  conversionRate: number;
};

export type ProductConversionData = {
  products: ProductConversionStat[];
  topProducts: ProductConversionStat[];
  bottomProducts: ProductConversionStat[];
};

export type ReservationConversionData = {
  summary: ConversionSummary;
  daily: DailyConversionStat[];
  products: ProductConversionData;
};
