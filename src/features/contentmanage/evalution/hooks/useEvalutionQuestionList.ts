import { useEffect, useMemo, useState } from "react";
import {
  deleteEvalutionQuestion,
  getEvalutionQuestions,
  getEvalutionResults,
} from "@/features/services/adminEvalution.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { CourseCountry } from "@/features/contentmanage/lecture/types";
import { getErrorMessage } from "@/features/services/error.service";
import {
  EvalutionQuestion,
  EvalutionQuestionSet,
  EvalutionResult,
} from "../types";

export const useEvalutionQuestionList = () => {
  const [questions, setQuestions] = useState<EvalutionQuestion[]>([]);
  const [results, setResults] = useState<EvalutionResult[]>([]);
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [activeTab, setActiveTab] = useState<"questions" | "results">("questions");
  const [selectedCountry, setSelectedCountry] = useState("전체");
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EvalutionQuestionSet | null>(
    null
  );
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountries = async () => {
      try {
        setError("");
        const data = await getCourseCountries(controller.signal);

        if (controller.signal.aborted) return;
        setCountries(data);
        setSelectedCountryId((prev) => prev ?? data[0]?.countryId ?? null);
        setSelectedCountry((prev) => prev === "전체" ? data[0]?.countryName ?? "전체" : prev);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "국가 목록을 불러오지 못했습니다."));
        setIsLoadingQuestions(false);
      }
    };

    void fetchCountries();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedCountryId) return;

    const controller = new AbortController();
    const selectedCountryName =
      countries.find((country) => country.countryId === selectedCountryId)?.countryName ?? "-";

    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        setError("");
        const data = await getEvalutionQuestions(
          selectedCountryId,
          selectedCountryName,
          controller.signal
        );

        if (controller.signal.aborted) return;
        setQuestions(data);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "진단평가 문제를 불러오지 못했습니다."));
        setQuestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingQuestions(false);
        }
      }
    };

    void fetchQuestions();

    return () => {
      controller.abort();
    };
  }, [countries, selectedCountryId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setIsLoadingResults(true);
        const data = await getEvalutionResults(controller.signal);

        if (controller.signal.aborted) return;
        setResults(data);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "진단평가 결과를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingResults(false);
        }
      }
    };

    void fetchResults();

    return () => {
      controller.abort();
    };
  }, []);

  const questionSets = useMemo<EvalutionQuestionSet[]>(() => {
    const grouped = questions.reduce<Record<string, EvalutionQuestion[]>>(
      (acc, question) => {
        const groupKey = `${question.countryId}`;

        acc[groupKey] = [...(acc[groupKey] ?? []), question];
        return acc;
      },
      {}
    );

    return Object.values(grouped).map((group) => {
      const sortedQuestions = [...group]
        .sort((a, b) => a.questionOrder - b.questionOrder || a.id - b.id)
        .slice(0, 5)
        .map((question, index) => ({
          ...question,
          questionOrder: index + 1,
        }));
      const firstQuestion = sortedQuestions[0];

      return {
        id: firstQuestion?.id ?? 0,
        countryId: firstQuestion?.countryId ?? 0,
        country: firstQuestion?.country ?? "-",
        questions: sortedQuestions,
      };
    });
  }, [questions]);

  const changeSelectedCountryId = (countryId: number | null) => {
    const country = countries.find((item) => item.countryId === countryId);

    setSelectedCountryId(countryId);
    setSelectedCountry(country?.countryName ?? "전체");
  };

  const toggleQuestionSet = (questionSetId: number) => {
    setExpandedId((prev) => (prev === questionSetId ? null : questionSetId));
  };

  const deleteQuestion = async () => {
    if (!deleteTarget) return;

    try {
      setIsProcessing(true);
      setError("");
      await Promise.all(
        deleteTarget.questions.map((question) => deleteEvalutionQuestion(question.id))
      );
      setQuestions((prev) =>
        prev.filter(
          (question) =>
            !deleteTarget.questions.some(
              (targetQuestion) => targetQuestion.id === question.id
            )
        )
      );
      setDeleteTarget(null);
      setDeleteCompleteOpen(true);
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError, "진단평가 문제 삭제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    activeTab,
    results,
    countries,
    selectedCountry,
    selectedCountryId,
    expandedId,
    filteredQuestionSets: questionSets,
    deleteTarget,
    deleteCompleteOpen,
    isLoadingQuestions,
    isLoadingResults,
    isProcessing,
    error,
    setActiveTab,
    setSelectedCountry,
    setSelectedCountryId: changeSelectedCountryId,
    setDeleteTarget,
    setDeleteCompleteOpen,
    toggleQuestionSet,
    deleteQuestion,
  };
};
