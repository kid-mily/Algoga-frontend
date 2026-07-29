import { ApiRequestError } from "@/lib/api";

export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const isAbortError = (error: unknown) => {
  return error instanceof DOMException && error.name === "AbortError";
};
