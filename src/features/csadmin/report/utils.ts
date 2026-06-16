import { ApiRequestError } from "@/lib/api";

export const formatReportError = (
  error: unknown,
  fallback: string
) => {
  if (error instanceof ApiRequestError) {
    return [
      fallback,
      `상태: ${error.status ?? "-"}`,
      `코드: ${error.code ?? "-"}`,
      `요청: ${error.url ?? "-"}`,
      `메시지: ${error.message}`,
    ].join("\n");
  }

  return error instanceof Error ? error.message : fallback;
};
