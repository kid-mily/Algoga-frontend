import { useEffect, useMemo, useState } from "react";
import {
  deleteEvalutionQuestion,
  getEvalutionQuestions,
} from "@/features/services/adminEvalution.service";
import { EvalutionLevel, EvalutionQuestion } from "../types";

export const useEvalutionQuestionList = (
  initialQuestions: EvalutionQuestion[]
) => {
  const [questions, setQuestions] =
    useState<EvalutionQuestion[]>(initialQuestions);
  const [selectedLevel, setSelectedLevel] = useState<EvalutionLevel | "전체">(
    "전체"
  );
  const [selectedCountry, setSelectedCountry] = useState("전체");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EvalutionQuestion | null>(
    null
  );
  const [deleteCompleteOpen, setDeleteCompleteOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchQuestions = async () => {
      try {
        const data = await getEvalutionQuestions();

        if (isActive) {
          setQuestions(data);
        }
      } catch (fetchError: unknown) {
        if (isActive) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "진단평가 문제를 불러오지 못했습니다."
          );
        }
      }
    };

    void fetchQuestions();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const levelMatched =
        selectedLevel === "전체" || question.level === selectedLevel;
      const countryMatched =
        selectedCountry === "전체" || question.country === selectedCountry;

      return levelMatched && countryMatched;
    });
  }, [questions, selectedLevel, selectedCountry]);

  const toggleQuestion = (questionId: number) => {
    setExpandedId((prev) => (prev === questionId ? null : questionId));
  };

  const deleteQuestion = async () => {
    if (!deleteTarget) return;

    try {
      setError("");
      await deleteEvalutionQuestion(deleteTarget.id);
      setQuestions((prev) =>
        prev.filter((question) => question.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
      setDeleteCompleteOpen(true);
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "진단평가 문제 삭제에 실패했습니다."
      );
    }
  };

  return {
    selectedLevel,
    selectedCountry,
    expandedId,
    filteredQuestions,
    deleteTarget,
    deleteCompleteOpen,
    error,
    setSelectedLevel,
    setSelectedCountry,
    setDeleteTarget,
    setDeleteCompleteOpen,
    toggleQuestion,
    deleteQuestion,
  };
};
