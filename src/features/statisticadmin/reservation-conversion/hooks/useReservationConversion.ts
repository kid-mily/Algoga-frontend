import { useCallback, useEffect, useMemo, useState } from "react";
import { getReservationConversionData } from "@/features/services/adminReservationConversion.service";
import {
  ConversionSummary,
  DailyConversionStat,
  ProductConversionData,
} from "../types";
import {
  formatConversionError,
  getDefaultConversionDateRange,
} from "../utils";

const emptySummary: ConversionSummary = {
  attemptCount: 0,
  completedCount: 0,
  conversionRate: 0,
};

const emptyProducts: ProductConversionData = {
  products: [],
  topProducts: [],
  bottomProducts: [],
};

export const useReservationConversion = () => {
  const defaultRange = useMemo(() => getDefaultConversionDateRange(), []);
  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [summary, setSummary] = useState<ConversionSummary>(emptySummary);
  const [daily, setDaily] = useState<DailyConversionStat[]>([]);
  const [products, setProducts] = useState<ProductConversionData>(emptyProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getReservationConversionData({
          from: fromDate,
          to: toDate,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setSummary(data.summary);
        setDaily(data.daily);
        setProducts(data.products);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          formatConversionError(
            loadError,
            "예약 전환율 분석 데이터를 불러오지 못했습니다."
          )
        );
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
  }, [fromDate, toDate]);

  const handleFromDateChange = useCallback((value: string) => {
    setFromDate(value);
    setToDate((currentToDate) => (currentToDate && value > currentToDate ? value : currentToDate));
  }, []);

  const handleToDateChange = useCallback((value: string) => {
    setToDate(value);
    setFromDate((currentFromDate) =>
      currentFromDate && value < currentFromDate ? value : currentFromDate
    );
  }, []);

  return {
    fromDate,
    toDate,
    summary,
    daily,
    products,
    isLoading,
    error,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
  };
};
