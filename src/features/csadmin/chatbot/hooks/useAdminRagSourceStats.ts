import { useCallback, useEffect, useState } from "react";
import { getAdminRagSourceStats } from "@/features/services/adminChatbot.service";
import { ChatbotPage, RagSourceStat } from "../types";

const emptyPage: ChatbotPage<RagSourceStat> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 1,
  first: true,
  last: true,
};

const TOP_COUNT = 10;

export const useAdminRagSourceStats = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ChatbotPage<RagSourceStat>>(emptyPage);
  const [topStats, setTopStats] = useState<RagSourceStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getAdminRagSourceStats({ from, to, page }, signal);

        if (signal?.aborted) return;

        setData(result);
      } catch (fetchError: unknown) {
        if (signal?.aborted) return;

        setData(emptyPage);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "RAG 채택 빈도를 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [from, to, page]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchStats(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchStats]);

  // TOP 10 차트: 표 페이징과 무관하게 항상 첫 페이지(count 내림차순 상위)를 조회한다.
  const fetchTop = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const result = await getAdminRagSourceStats({ from, to, page: 0 }, signal);

        if (signal?.aborted) return;

        setTopStats(result.content.slice(0, TOP_COUNT));
      } catch {
        if (signal?.aborted) return;

        setTopStats([]);
      }
    },
    [from, to]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchTop(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchTop]);

  const applySearch = (next: { from: string; to: string }) => {
    setFrom(next.from);
    setTo(next.to);
    setPage(0);
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setPage(0);
  };

  return {
    data,
    topStats,
    isLoading,
    error,
    from,
    to,
    page,
    setPage,
    applySearch,
    reset,
  };
};
