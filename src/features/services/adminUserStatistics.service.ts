import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { SignupPathStatistic } from "@/features/statisticadmin/user/types";
import {
  normalizeSignupPathKey,
  normalizeSignupPathLabel,
  signupPathColors,
} from "@/features/statisticadmin/user/utils";

type UnknownRecord = Record<string, unknown>;

const defaultSignupPaths = ["search", "social", "friend", "ad", "etc"];

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.statistics)) return record.statistics;
  if (Array.isArray(record.signupPaths)) return record.signupPaths;
  if (Array.isArray(record.data)) return record.data;

  return [];
};

const getString = (record: UnknownRecord, keys: string[], fallback = "") => {
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

const normalizeSignupPathStatistic = (
  item: unknown,
  index: number
): SignupPathStatistic => {
  const record = getRecord(item);
  const rawSignupPath = getString(record, [
    "signupPath",
    "path",
    "source",
    "route",
    "inflowPath",
  ]);
  const signupPath = normalizeSignupPathKey(rawSignupPath);
  const label = getString(record, ["label", "name", "pathName"]);

  return {
    signupPath,
    label: signupPath === "etc" ? "기타" : label || normalizeSignupPathLabel(signupPath),
    signupCount: getNumber(record, [
      "signupCount",
      "count",
      "userCount",
      "memberCount",
      "totalCount",
    ]),
    ratio: getNumber(record, ["ratio", "rate", "percentage"]),
    color: signupPathColors[index % signupPathColors.length],
  };
};

const mergeSignupPathStatistics = (
  statistics: SignupPathStatistic[]
): SignupPathStatistic[] => {
  const merged = statistics.reduce<Map<string, SignupPathStatistic>>(
    (accumulator, statistic) => {
      const key = statistic.signupPath || statistic.label;
      const current = accumulator.get(key);

      if (!current) {
        accumulator.set(key, { ...statistic, ratio: 0 });
        return accumulator;
      }

      accumulator.set(key, {
        ...current,
        signupCount: current.signupCount + statistic.signupCount,
      });

      return accumulator;
    },
    new Map()
  );

  const mergedStatistics = defaultSignupPaths.map((signupPath) => {
    const statistic = merged.get(signupPath);

    return (
      statistic ?? {
        signupPath,
        label: normalizeSignupPathLabel(signupPath),
        signupCount: 0,
        ratio: 0,
        color: signupPathColors[0],
      }
    );
  });

  return mergedStatistics.map((statistic, index) => ({
    ...statistic,
    color: signupPathColors[index % signupPathColors.length],
  }));
};

const withCalculatedRatio = (
  statistics: SignupPathStatistic[]
): SignupPathStatistic[] => {
  const totalSignupCount = statistics.reduce(
    (sum, statistic) => sum + statistic.signupCount,
    0
  );

  if (totalSignupCount <= 0) return statistics;

  return statistics.map((statistic) => ({
    ...statistic,
    ratio: (statistic.signupCount / totalSignupCount) * 100,
  }));
};

export const getSignupPathStatistics = async (
  signal?: AbortSignal
): Promise<SignupPathStatistic[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/users/statistics/signup-paths",
    {
      suppressGlobalError: true,
      signal,
    }
  );

  return withCalculatedRatio(
    mergeSignupPathStatistics(getItems(unwrapData(response)).map(normalizeSignupPathStatistic))
      .sort((first, second) => second.signupCount - first.signupCount)
  );
};
