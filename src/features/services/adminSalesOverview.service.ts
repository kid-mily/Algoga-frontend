import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  SalesOverview,
  SalesOverviewMonthlyStat,
  SalesOverviewQuery,
} from "@/features/statisticadmin/sales/types";

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
