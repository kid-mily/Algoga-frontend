import { getRepurchaseLtvData } from "@/features/services/adminRepurchaseLtvStatistics.service";
import { adminApi } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  adminApi: { get: jest.fn() },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response && typeof response === "object" && "data" in response ? response.data : response,
}));

const query = { from: "2026-07-01", to: "2026-07-22" };

describe("재구매·LTV 서비스 테스트", () => {
  beforeEach(() => jest.clearAllMocks());

  test("세 API를 동일한 기간과 signal로 호출한다", async () => {
    const controller = new AbortController();
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { repeatRate: 32.5, arpu: 450_000, avgIntervalDays: 42, top10RevenueShare: 61.3 } })
      .mockResolvedValueOnce({ data: { maxMonths: 3, cohorts: [] } })
      .mockResolvedValueOnce({ data: [] });

    await getRepurchaseLtvData(query, controller.signal);

    expect(adminApi.get).toHaveBeenCalledTimes(3);
    expect(adminApi.get).toHaveBeenNthCalledWith(1, "/api/v1/admin/stats/retention/summary", { params: query, suppressGlobalError: true, signal: controller.signal });
    expect(adminApi.get).toHaveBeenNthCalledWith(2, "/api/v1/admin/stats/retention/cohort", { params: query, suppressGlobalError: true, signal: controller.signal });
    expect(adminApi.get).toHaveBeenNthCalledWith(3, "/api/v1/admin/stats/retention/top-customers", { params: query, suppressGlobalError: true, signal: controller.signal });
  });

  test("요약, 코호트, 상위 고객 응답을 화면 모델로 변환한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { repeatRate: 32.5, arpu: 450_000, avgIntervalDays: 42, top10RevenueShare: 61.3 } })
      .mockResolvedValueOnce({ data: { maxMonths: 3, cohorts: [{ cohortMonth: "2026-05", cohortSize: 100, retentionRate: [100, 45, null], cumulativeRevenue: [10_000_000, 14_000_000, null] }] } })
      .mockResolvedValueOnce({ data: [{ rank: 1, userName: "홍길동", bookingCount: 7, totalPaid: 3_500_000, recentDestination: "일본", avgIntervalDays: 30 }] });

    await expect(getRepurchaseLtvData(query)).resolves.toEqual({
      summary: { repurchaseRate: 32.5, arpu: 450_000, averagePurchaseIntervalDays: 42, topCustomerRevenueShare: 61.3 },
      maxMonths: 3,
      cohorts: [{ cohortMonth: "2026-05", cohortSize: 100, retentionRate: [100, 45, null], cumulativeRevenue: [10_000_000, 14_000_000, null] }],
      topCustomers: [{ rank: 1, name: "홍길동", bookingCount: 7, cumulativePayment: 3_500_000, recentDestination: "일본", averagePurchaseIntervalDays: 30 }],
    });
  });

  test("null 숫자와 누락된 문자열 및 배열을 안전한 기본값으로 변환한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { repeatRate: null, arpu: null, avgIntervalDays: null, top10RevenueShare: null } })
      .mockResolvedValueOnce({ data: { maxMonths: 0, cohorts: [{ cohortMonth: "2026-06", cohortSize: null, retentionRate: null, cumulativeRevenue: null }] } })
      .mockResolvedValueOnce({ data: [{ rank: null, userName: "", bookingCount: null, totalPaid: null, recentDestination: "", avgIntervalDays: null }] });

    const result = await getRepurchaseLtvData(query);

    expect(result.summary).toEqual({ repurchaseRate: 0, arpu: 0, averagePurchaseIntervalDays: 0, topCustomerRevenueShare: 0 });
    expect(result.maxMonths).toBe(12);
    expect(result.cohorts).toEqual([{ cohortMonth: "2026-06", cohortSize: 0, retentionRate: [], cumulativeRevenue: [] }]);
    expect(result.topCustomers).toEqual([{ rank: 0, name: "-", bookingCount: 0, cumulativePayment: 0, recentDestination: "-", averagePurchaseIntervalDays: 0 }]);
  });

  test("코호트와 상위 고객 응답이 없으면 빈 배열과 기본 월 수를 반환한다", async () => {
    (adminApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({ data: null });

    const result = await getRepurchaseLtvData(query);
    expect(result.maxMonths).toBe(12);
    expect(result.cohorts).toEqual([]);
    expect(result.topCustomers).toEqual([]);
  });
});
