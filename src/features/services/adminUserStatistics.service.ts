import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { SignupPathChannelRevenue, SignupPathSummary } from "@/features/statisticadmin/user/types";
import {
  normalizeSignupPathKey,
  normalizeSignupPathLabel,
  signupPathColors,
} from "@/features/statisticadmin/user/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type InflowQuery = {
  from: string;
  to: string;
};

type InflowSummaryResponse = {
  totalSignups: number;
  totalNetRevenue: number;
  topChannel: string;
  topChannelArpu: number;
};

type InflowChannelResponse = {
  channel: string;
  signupCount: number;
  netRevenue: number;
  arpu: number;
  bookingCount: number;
  bookingConversionRate: number;
};

// 전체 가입자·순매출·최고 효율 경로(ARPU) 요약
export const getInflowSummary = async (
  { from, to }: InflowQuery,
  signal?: AbortSignal
): Promise<SignupPathSummary> => {
  const response = await adminApi.get<ApiResult<InflowSummaryResponse>>(
    "/api/v1/admin/stats/inflow/summary",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return {
    totalSignupCount: Number(data?.totalSignups || 0),
    totalNetSales: Number(data?.totalNetRevenue || 0),
    bestEfficiencyPathLabel: data?.topChannel
      ? normalizeSignupPathLabel(data.topChannel)
      : "-",
    bestEfficiencyPathArpu: Number(data?.topChannelArpu || 0),
  };
};

// 유입 경로별 가입자 수/순매출/1인당 매출 (순매출 내림차순) — 가입자수 비율/상세표에도 그대로 씁니다.
export const getInflowChannelRevenue = async (
  { from, to }: InflowQuery,
  signal?: AbortSignal
): Promise<SignupPathChannelRevenue[]> => {
  const response = await adminApi.get<ApiResult<InflowChannelResponse[]>>(
    "/api/v1/admin/stats/inflow/channels",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const items = unwrapData(response) ?? [];
  const totalSignupCount = items.reduce(
    (sum, item) => sum + Number(item.signupCount || 0),
    0
  );

  return items
    .map((item, index) => {
      const signupPath = normalizeSignupPathKey(item.channel);
      const signupCount = Number(item.signupCount || 0);

      return {
        signupPath,
        label: normalizeSignupPathLabel(item.channel || signupPath),
        signupCount,
        ratio: totalSignupCount > 0 ? (signupCount / totalSignupCount) * 100 : 0,
        netSales: Number(item.netRevenue || 0),
        arpu: Number(item.arpu || 0),
        bookingCount: Number(item.bookingCount || 0),
        // 이미 %로 내려옴 (stats 도메인 rate 필드 공통 방식) — ×100 하지 않습니다.
        bookingConversionRate: Number(item.bookingConversionRate || 0),
        color: signupPathColors[index % signupPathColors.length],
      };
    })
    .sort((first, second) => second.netSales - first.netSales);
};

const downloadAdminCsv = async (path: string, filename: string) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "text/csv",
    },
  });

  if (!response.ok) {
    throw new Error("CSV 다운로드에 실패했습니다.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadInflowChannelsCsv = async ({ from, to }: InflowQuery) => {
  const params = new URLSearchParams({ from, to });
  await downloadAdminCsv(
    `/api/v1/admin/stats/inflow/channels/csv?${params.toString()}`,
    "inflow-channels.csv"
  );
};
