import { ApiRequestError } from "@/lib/api";

export const getErrorRecord = (error: unknown) => {
  if (!(error instanceof ApiRequestError)) return {};

  return error.body && typeof error.body === "object"
    ? (error.body as Record<string, unknown>)
    : {};
};

export const getErrorCode = (error: unknown) => {
  const record = getErrorRecord(error);
  const code = record.errorCode ?? record.code;

  return typeof code === "string" ? code : "";
};

export const getErrorMessage = (error: unknown, fallback = "") => {
  const record = getErrorRecord(error);
  const message = record.message;

  return typeof message === "string" && message.trim() ? message : fallback;
};

export const getErrorNumber = (
  error: unknown,
  key: string,
  fallback = 0
) => {
  const record = getErrorRecord(error);
  const value = record[key];
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};
