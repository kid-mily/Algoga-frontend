import { useCallback, useEffect, useState } from "react";
import { getAdminChatLogs } from "@/features/services/adminChatbot.service";
import { AdminChatLog, ChatbotPage } from "../types";

// 답변 상태 필터: ALL=전체, NORMAL=정상만(filtered=false), BLOCKED=차단만(filtered=true)
export type ChatLogStatusFilter = "ALL" | "NORMAL" | "BLOCKED";

const statusToFiltered = (
  status: ChatLogStatusFilter
): boolean | undefined => {
  if (status === "NORMAL") return false;
  if (status === "BLOCKED") return true;

  return undefined;
};

const emptyPage: ChatbotPage<AdminChatLog> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 1,
  first: true,
  last: true,
};

export const useAdminChatLogs = () => {
  const [status, setStatusState] = useState<ChatLogStatusFilter>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ChatbotPage<AdminChatLog>>(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getAdminChatLogs(
          { filtered: statusToFiltered(status), from, to, keyword, page },
          signal
        );

        if (signal?.aborted) return;

        setData(result);
      } catch (fetchError: unknown) {
        if (signal?.aborted) return;

        setData(emptyPage);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "대화 로그를 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [status, from, to, keyword, page]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchLogs(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchLogs]);

  // 상태 토글은 즉시 반영, 첫 페이지로 이동
  const setStatus = (next: ChatLogStatusFilter) => {
    setStatusState(next);
    setPage(0);
  };

  // 기간/키워드는 "조회" 버튼에서 한 번에 적용
  const applySearch = (next: { from: string; to: string; keyword: string }) => {
    setFrom(next.from);
    setTo(next.to);
    setKeyword(next.keyword);
    setPage(0);
  };

  const reset = () => {
    setStatusState("ALL");
    setFrom("");
    setTo("");
    setKeyword("");
    setPage(0);
  };

  return {
    data,
    isLoading,
    error,
    status,
    page,
    appliedFrom: from,
    appliedTo: to,
    appliedKeyword: keyword,
    setStatus,
    setPage,
    applySearch,
    reset,
  };
};
