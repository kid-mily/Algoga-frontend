import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  SignupPathChannelRevenue,
  SignupPathCount,
  SignupPathSummary,
} from "@/features/statisticadmin/user/types";
import {
  normalizeSignupPathKey,
  normalizeSignupPathLabel,
  signupPathColors,
} from "@/features/statisticadmin/user/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 문서상 from/to는 선택값이지만, 실제로는 'from'이 없으면 400(GLOBAL_002)을 반환해서
// 넓은 기본 기간을 항상 같이 보냅니다. 순수 날짜, LocalDateTime 형식 둘 다 타입
// 불일치 오류가 나서, +09:00 오프셋까지 붙인 Instant/OffsetDateTime 형식으로 보냅니다.
const DEFAULT_FROM_DATE_TIME = "2000-01-01T00:00:00+09:00";

const getTodayEndDateTime = () => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return `${today}T23:59:59+09:00`;
};

type SignupPathCountResponse = {
  path: string;
  count: number;
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
};

const normalizeSignupPathCounts = (
  items: SignupPathCountResponse[]
): SignupPathCount[] => {
  const totalSignupCount = items.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  return items.map((item, index) => {
    const signupPath = normalizeSignupPathKey(item.path);
    const signupCount = Number(item.count || 0);

    return {
      signupPath,
      label: normalizeSignupPathLabel(item.path || signupPath),
      signupCount,
      ratio: totalSignupCount > 0 ? (signupCount / totalSignupCount) * 100 : 0,
      color: signupPathColors[index % signupPathColors.length],
    };
  });
};

// 가입일 기준 기간 내 유입 경로별 가입자 수 (from/to 생략 시 전체 기간)
export const getSignupPathCounts = async (
  query: { from?: string; to?: string } = {},
  signal?: AbortSignal
): Promise<SignupPathCount[]> => {
  const response = await adminApi.get<ApiResult<SignupPathCountResponse[]>>(
    "/api/v1/admin/users/statistics/signup-paths",
    {
      // 문서대로 from/to를 생략하면 전체 기간을 조회하므로, 값이 있을 때만 보냅니다.
      params: {
        from: query.from,
        to: query.to,
      },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeSignupPathCounts(unwrapData(response) ?? []);
};

// 전체 가입자·순매출·최고 효율 경로(ARPU) 요약
export const getInflowSummary = async (
  signal?: AbortSignal
): Promise<SignupPathSummary> => {
  const response = await adminApi.get<ApiResult<InflowSummaryResponse>>(
    "/api/v1/admin/stats/inflow/summary",
    {
      params: {
        from: DEFAULT_FROM_DATE_TIME,
        to: getTodayEndDateTime(),
      },
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

// 유입 경로별 가입자 수/순매출/1인당 매출 (순매출 내림차순)
export const getInflowChannelRevenue = async (
  signal?: AbortSignal
): Promise<SignupPathChannelRevenue[]> => {
  const response = await adminApi.get<ApiResult<InflowChannelResponse[]>>(
    "/api/v1/admin/stats/inflow/channels",
    {
      params: {
        from: DEFAULT_FROM_DATE_TIME,
        to: getTodayEndDateTime(),
      },
      suppressGlobalError: true,
      signal,
    }
  );
  const items = unwrapData(response) ?? [];

  return items
    .map((item, index) => {
      const signupPath = normalizeSignupPathKey(item.channel);

      return {
        signupPath,
        label: normalizeSignupPathLabel(item.channel || signupPath),
        signupCount: Number(item.signupCount || 0),
        netSales: Number(item.netRevenue || 0),
        arpu: Number(item.arpu || 0),
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

export const downloadSignupPathCsv = async () => {
  await downloadAdminCsv(
    "/api/v1/admin/users/statistics/signup-paths/csv",
    "signup-paths.csv"
  );
};

export const downloadInflowChannelsCsv = async () => {
  await downloadAdminCsv(
    "/api/v1/admin/stats/inflow/channels/csv",
    "inflow-channels.csv"
  );
};
