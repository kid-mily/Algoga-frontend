import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  SalesOverview,
  SalesOverviewMonthlyStat,
  SalesOverviewQuery,
  SalesTrendPoint,
  SalesTrendUnit,
} from "@/features/statisticadmin/finances/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RawSalesOverviewMonthlyStat = {
  month: string;
  revenue: number;
  refund: number;
  net: number;
  refundRate: number;
  growthRate: number | null;
};

type RawSalesOverview = {
  netRevenue: number;
  outstandingBalance: number;
  refundRate: number;
  balanceConversionRate: number;
  monthly: RawSalesOverviewMonthlyStat[];
};

const normalizeMonthlyStat = (
  item: RawSalesOverviewMonthlyStat
): SalesOverviewMonthlyStat => ({
  month: item.month,
  grossSales: item.revenue ?? 0,
  refundAmount: item.refund ?? 0,
  netSales: item.net ?? 0,
  refundRate: item.refundRate ?? 0,
  changeRate: item.growthRate ?? null,
});

// 백엔드가 아직 전 기간 대비 증감률(변화율)을 내려주지 않아 0으로 처리합니다.
const normalizeSalesOverview = (raw: RawSalesOverview): SalesOverview => ({
  netSales: raw.netRevenue ?? 0,
  receivableAmount: raw.outstandingBalance ?? 0,
  refundRate: raw.refundRate ?? 0,
  balanceConversionRate: raw.balanceConversionRate ?? 0,
  netSalesChangeRate: 0,
  receivableChangeRate: 0,
  refundRateChange: 0,
  balanceConversionRateChange: 0,
  monthlyStats: (raw.monthly ?? []).map(normalizeMonthlyStat),
});

export const getSalesOverview = async (
  { from, to }: SalesOverviewQuery,
  signal?: AbortSignal
): Promise<SalesOverview> => {
  const response = await adminApi.get<ApiResult<RawSalesOverview>>(
    "/api/v1/admin/stats/overview",
    {
      params: { from, to },
      signal,
      suppressGlobalError: true,
    }
  );

  return normalizeSalesOverview(unwrapData(response));
};

type RawSalesTrendPoint = {
  label: string;
  totalRevenue: number;
  refund: number;
  netRevenue: number;
};

// 차트 전용 추이 API. unit(HOUR/DAY/MONTH)에 맞춰 x축 버킷이 달라집니다.
export const getSalesOverviewTrend = async (
  { from, to }: SalesOverviewQuery,
  unit: SalesTrendUnit,
  signal?: AbortSignal
): Promise<SalesTrendPoint[]> => {
  const response = await adminApi.get<ApiResult<RawSalesTrendPoint[]>>(
    "/api/v1/admin/stats/overview/trend",
    {
      params: { from, to, unit },
      signal,
      suppressGlobalError: true,
    }
  );

  return (unwrapData(response) ?? []).map((item) => ({
    label: item.label,
    totalRevenue: item.totalRevenue ?? 0,
    refund: item.refund ?? 0,
    netRevenue: item.netRevenue ?? 0,
  }));
};

// 월별 매출 상세 CSV (화면 표와 동일 컬럼). 선택된 기간(from/to)으로 내려받습니다.
export const downloadSalesOverviewCsv = async ({
  from,
  to,
}: SalesOverviewQuery) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const url = new URL(`${API_BASE_URL}/api/v1/admin/stats/overview/csv`);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const response = await fetch(url.toString(), {
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
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = "sales-overview.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
