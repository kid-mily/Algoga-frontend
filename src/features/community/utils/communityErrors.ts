import { ApiRequestError } from "@/lib/api";

export const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const isAlreadyReportedError = (error: unknown) => {
  const message = getRequestErrorMessage(error, "");
  const code = error instanceof ApiRequestError ? error.code ?? "" : "";

  return (
    (error instanceof ApiRequestError && error.status === 409) ||
    message.includes("이미 신고") ||
    code.includes("ALREADY_REPORTED")
  );
};
