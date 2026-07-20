import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminSuggestedQuestions } from "@/features/services/adminChatbot.service";
import { ChatbotQuestion } from "../types";

export const useChatbotQuestionList = () => {
  const [questions, setQuestions] = useState<ChatbotQuestion[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminSuggestedQuestions(signal);

      if (signal?.aborted) return;

      setQuestions(
        data.map((item) => ({
          id: item.suggestedQuestionId,
          question: item.question,
          answer: item.answer,
        }))
      );
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setQuestions([]);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "예상 질문 목록을 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchQuestions(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchQuestions]);

  const filteredQuestions = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return questions;

    return questions.filter(
      (question) =>
        question.question.toLowerCase().includes(keyword) ||
        question.answer.toLowerCase().includes(keyword)
    );
  }, [questions, searchKeyword]);

  return {
    filteredQuestions,
    totalCount: questions.length,
    searchKeyword,
    isLoading,
    error,
    setSearchKeyword,
    setError,
    refetch: fetchQuestions,
  };
};
