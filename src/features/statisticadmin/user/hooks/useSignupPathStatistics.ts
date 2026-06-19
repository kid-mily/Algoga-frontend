import { useEffect, useMemo, useState } from "react";
import { getSignupPathStatistics } from "@/features/services/adminUserStatistics.service";
import { SignupPathStatistic } from "../types";
import {
  formatSignupPathError,
  getSignupPathSummary,
} from "../utils";

export const useSignupPathStatistics = () => {
  const [statistics, setStatistics] = useState<SignupPathStatistic[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPath, setSelectedPath] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getSignupPathStatistics(controller.signal);

        if (controller.signal.aborted) return;

        setStatistics(data);
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
  }, []);

  const pathOptions = useMemo(
    () => [
      { value: "all", label: "전체" },
      ...statistics.map((statistic) => ({
        value: statistic.signupPath || statistic.label,
        label: statistic.label,
      })),
    ],
    [statistics]
  );

  const filteredStatistics = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return statistics.filter((statistic) => {
      const matchesPath =
        selectedPath === "all" ||
        statistic.signupPath === selectedPath ||
        statistic.label === selectedPath;
      const matchesKeyword =
        !keyword ||
        [statistic.signupPath, statistic.label]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesPath && matchesKeyword;
    });
  }, [searchKeyword, selectedPath, statistics]);

  const summary = useMemo(
    () => getSignupPathSummary(statistics),
    [statistics]
  );

  return {
    statistics,
    filteredStatistics,
    pathOptions,
    summary,
    searchKeyword,
    selectedPath,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedPath,
  };
};
