import { useEffect, useState } from "react";
import { getRevenueDetailData } from "@/features/services/adminRevenue.service";
import { RevenueDetailData } from "../types";
import { formatRevenueError } from "../utils";

export const useRevenueDetail = (year: number, month: number) => {
  const [data, setData] = useState<RevenueDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const detailData = await getRevenueDetailData(year, month, controller.signal);

        if (controller.signal.aborted) return;
        setData(detailData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setData(null);
        setError(formatRevenueError(loadError, "월별 수익 상세를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [month, year]);

  return {
    data,
    isLoading,
    error,
  };
};
