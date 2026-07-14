import { useEffect, useState } from "react";
import {
  getInflowChannelRevenue,
  getInflowSummary,
  getSignupPathCounts,
} from "@/features/services/adminUserStatistics.service";
import {
  SignupPathChannelRevenue,
  SignupPathCount,
  SignupPathSummary,
} from "../types";
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
  const [pathCounts, setPathCounts] = useState<SignupPathCount[]>([]);
  const [channelRevenue, setChannelRevenue] = useState<
    SignupPathChannelRevenue[]
  >([]);
  const [summary, setSummary] = useState<SignupPathSummary>(emptySummary);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [error, setError] = useState("");

  // summary/channels API는 기간 파라미터를 지원하지 않아 최초 1회만 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoadingOverview(true);
        setError("");

        const [summaryData, channels] = await Promise.all([
          getInflowSummary(controller.signal),
          getInflowChannelRevenue(controller.signal),
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
          setIsLoadingOverview(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  // signup-paths API는 기간 파라미터를 지원해 선택된 기간이 바뀔 때마다 다시 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoadingCounts(true);
        setError("");

        const counts = await getSignupPathCounts(
          getSignupPathDateRange(selectedPeriod),
          controller.signal
        );

        if (controller.signal.aborted) return;

        setPathCounts(counts);
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
          setIsLoadingCounts(false);
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
    pathCounts,
    channelRevenue,
    summary,
    isLoading: isLoadingCounts || isLoadingOverview,
    isLoadingCounts,
    isLoadingOverview,
    error,
  };
};
