import {
  getCountryProfitItems,
  getCountryProfitSummary,
} from "@/features/services/adminCountryProfitStatistics.service";
import { adminApi } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  adminApi: {
    get: jest.fn(),
  },
  unwrapData: <T,>(response: { data?: T } | T) =>
    response &&
    typeof response === "object" &&
    "data" in response
      ? response.data
      : response,
}));

const query = {
  from: "2026-07-01",
  to: "2026-07-22",
};

describe("나라별 수익성 서비스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("요약 API 응답을 화면 모델로 변환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: {
        countryCount: 5,
        totalBookingCount: 120,
        totalNetRevenue: 85_000_000,
        avgRefundRate: 4.5,
        topCountryName: "일본",
        topCountryShare: 35,
      },
    });

    const result =
      await getCountryProfitSummary(query);

    expect(result).toEqual({
      countryCount: 5,
      totalNetRevenue: 85_000_000,
      averageRefundRate: 4.5,
    });

    expect(adminApi.get).toHaveBeenCalledWith(
      "/api/v1/admin/stats/country-profit/summary",
      expect.objectContaining({
        params: query,
        suppressGlobalError: true,
      })
    );
  });

  test("나라별 목록 API 응답을 화면 모델로 변환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          countryId: 1,
          countryName: "일본",
          bookingCount: 50,
          grossRevenue: 50_000_000,
          netRevenue: 42_000_000,
          refundRate: 4,
          balanceConversionRate: 75,
          cancelRate: 3,
          share: 35,
        },
      ],
    });

    const result =
      await getCountryProfitItems(query);

    expect(result).toEqual([
      {
        countryName: "일본",
        bookingCount: 50,
        grossRevenue: 50_000_000,
        netRevenue: 42_000_000,
        refundRate: 4,
        balanceConversionRate: 75,
        cancelRate: 3,
        share: 35,
      },
    ]);

    expect(adminApi.get).toHaveBeenCalledWith(
      "/api/v1/admin/stats/country-profit",
      expect.objectContaining({
        params: {
          from: "2026-07-01",
          to: "2026-07-22",
          search: undefined,
        },
        suppressGlobalError: true,
      })
    );
  });

  test("검색어 앞뒤 공백을 제거해 목록 API에 전달한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    await getCountryProfitItems({
      ...query,
      search: "  일본  ",
    });

    expect(adminApi.get).toHaveBeenCalledWith(
      "/api/v1/admin/stats/country-profit",
      expect.objectContaining({
        params: {
          from: "2026-07-01",
          to: "2026-07-22",
          search: "일본",
        },
      })
    );
  });

  test("빈 검색어는 undefined로 전달한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    await getCountryProfitItems({
      ...query,
      search: "   ",
    });

    expect(adminApi.get).toHaveBeenCalledWith(
      "/api/v1/admin/stats/country-profit",
      expect.objectContaining({
        params: {
          from: "2026-07-01",
          to: "2026-07-22",
          search: undefined,
        },
      })
    );
  });

  test("null 숫자 필드를 0으로 변환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          countryId: 1,
          countryName: "태국",
          bookingCount: null,
          grossRevenue: null,
          netRevenue: null,
          refundRate: null,
          balanceConversionRate: null,
          cancelRate: null,
          share: null,
        },
      ],
    });

    const result =
      await getCountryProfitItems(query);

    expect(result).toEqual([
      {
        countryName: "태국",
        bookingCount: 0,
        grossRevenue: 0,
        netRevenue: 0,
        refundRate: 0,
        balanceConversionRate: 0,
        cancelRate: 0,
        share: 0,
      },
    ]);
  });

  test("요약의 null 숫자 필드를 0으로 변환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: {
        countryCount: null,
        totalBookingCount: null,
        totalNetRevenue: null,
        avgRefundRate: null,
        topCountryName: null,
        topCountryShare: null,
      },
    });

    const result =
      await getCountryProfitSummary(query);

    expect(result).toEqual({
      countryCount: 0,
      totalNetRevenue: 0,
      averageRefundRate: 0,
    });
  });

  test("목록 응답이 null이면 빈 배열을 반환한다", async () => {
    (adminApi.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const result =
      await getCountryProfitItems(query);

    expect(result).toEqual([]);
  });
});