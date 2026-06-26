import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  ConversionSummary,
  DailyConversionStat,
  ProductConversionData,
  ProductConversionStat,
  ReservationConversionData,
} from "@/features/statisticadmin/reservation-conversion/types";

type UnknownRecord = Record<string, unknown>;

type ConversionQuery = {
  from: string;
  to: string;
  signal?: AbortSignal;
};

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown, key?: string) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (key && Array.isArray(record[key])) return record[key] as unknown[];
  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;

  return [];
};

const getString = (record: UnknownRecord, keys: string[], fallback = "-") => {
  const value = keys
    .map((key) => record[key])
    .find(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(typeof item === "string" && !item.trim())
    );

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getNumber = (record: UnknownRecord, keys: string[], fallback = 0) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeConversionSummary = (item: unknown): ConversionSummary => {
  const record = getRecord(item);

  return {
    attemptCount: getNumber(record, ["attemptCount", "attempts"]),
    completedCount: getNumber(record, ["completedCount", "completed"]),
    conversionRate: getNumber(record, ["conversionRate", "rate"]),
  };
};

export const normalizeDailyConversionStat = (
  item: unknown,
  fallbackDate = "-"
): DailyConversionStat => {
  const record = getRecord(item);

  return {
    date: getString(record, ["date", "day"], fallbackDate),
    attemptCount: getNumber(record, ["attemptCount", "attempts"]),
    completedCount: getNumber(record, ["completedCount", "completed"]),
    conversionRate: getNumber(record, ["conversionRate", "rate"]),
  };
};

export const normalizeProductConversionStat = (
  item: unknown
): ProductConversionStat => {
  const record = getRecord(item);

  return {
    accommodationId: getNumber(record, ["accommodationId", "productId", "id"]),
    productName: getString(record, ["productName", "name", "accommodationName"], "-"),
    attemptCount: getNumber(record, ["attemptCount", "attempts"]),
    completedCount: getNumber(record, ["completedCount", "completed"]),
    conversionRate: getNumber(record, ["conversionRate", "rate"]),
  };
};

export const normalizeProductConversionData = (
  item: unknown
): ProductConversionData => {
  const record = getRecord(item);
  const products = getItems(record.products).map(normalizeProductConversionStat);
  const topProducts = getItems(record.topProducts).map(normalizeProductConversionStat);
  const bottomProducts = getItems(record.bottomProducts).map(
    normalizeProductConversionStat
  );

  return {
    products,
    topProducts,
    bottomProducts,
  };
};

export const getReservationConversionSummary = async ({
  from,
  to,
  signal,
}: ConversionQuery): Promise<ConversionSummary> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/conversion/summary",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeConversionSummary(unwrapData(response));
};

export const getDailyReservationConversions = async ({
  from,
  to,
  signal,
}: ConversionQuery): Promise<DailyConversionStat[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/conversion/daily",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return getItems(data).map((item) => normalizeDailyConversionStat(item));
};

export const getProductReservationConversions = async ({
  from,
  to,
  signal,
}: ConversionQuery): Promise<ProductConversionData> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/conversion/products",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeProductConversionData(unwrapData(response));
};

export const getReservationConversionData = async ({
  from,
  to,
  signal,
}: ConversionQuery): Promise<ReservationConversionData> => {
  const [summary, daily, products] = await Promise.all([
    getReservationConversionSummary({ from, to, signal }),
    getDailyReservationConversions({ from, to, signal }),
    getProductReservationConversions({ from, to, signal }),
  ]);

  return { summary, daily, products };
};
