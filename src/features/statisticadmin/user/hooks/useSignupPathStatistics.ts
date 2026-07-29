import { useEffect, useState } from "react";
import {
  getInflowChannelRevenue,
  getInflowSummary,
} from "@/features/services/adminUserStatistics.service";
import { SignupPathChannelRevenue, SignupPathSummary } from "../types";
import {
  formatSignupPathError,
  getSignupPathDateRange,
  SignupPathPeriod,
} from "../utils";

const emptySummary: SignupPathSummary = {
  totalSignupCount: 0,
  totalNetSales: 0,
  bestEfficiencyPathLabel: "-",
  bestEfficiencyPathArpu: 0,
};

export const useSignupPathStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<SignupPathPeriod>("all");
  const [channelRevenue, setChannelRevenue] = useState<
    SignupPathChannelRevenue[]
  >([]);
  const [summary, setSummary] = useState<SignupPathSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = getSignupPathDateRange(selectedPeriod);

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summaryData, channels] = await Promise.all([
          getInflowSummary(query, controller.signal),
          getInflowChannelRevenue(query, controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setSummary(summaryData);
        setChannelRevenue(channels);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          formatSignupPathError(
            loadError,
            "유저 유입 경로 통계를 불러오지 못했습니다."
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
  }, [selectedPeriod]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    channelRevenue,
    summary,
    isLoading,
    error,
  };
};
