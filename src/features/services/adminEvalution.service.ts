import {
  defaultEvalutionQuestions,
  EvalutionQuestion,
  EvalutionQuestionFormData,
} from "@/features/contentmanage/evalution/types";

const STORAGE_KEY = "adminEvalutionQuestions:v2";

const getStoredQuestions = (): EvalutionQuestion[] => {
  if (typeof window === "undefined") {
    return defaultEvalutionQuestions;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultEvalutionQuestions)
    );
    return defaultEvalutionQuestions;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultEvalutionQuestions;
  } catch {
    return defaultEvalutionQuestions;
  }
};

const saveQuestions = (questions: EvalutionQuestion[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

export const getEvalutionQuestions = async () => {
  return getStoredQuestions();
};

export const getEvalutionQuestion = async (id: number) => {
  return getStoredQuestions().find((question) => question.id === id) ?? null;
};

export const createEvalutionQuestion = async (
  payload: EvalutionQuestionFormData
) => {
  const questions = getStoredQuestions();
  const nextId = Math.max(0, ...questions.map((question) => question.id)) + 1;
  const nextQuestion: EvalutionQuestion = {
    id: nextId,
    ...payload,
  };

  saveQuestions([nextQuestion, ...questions]);
  return nextQuestion;
};

export const updateEvalutionQuestion = async (
  id: number,
  payload: EvalutionQuestionFormData
) => {
  const questions = getStoredQuestions();
  const nextQuestions = questions.map((question) =>
    question.id === id ? { id, ...payload } : question
  );

  saveQuestions(nextQuestions);
  return nextQuestions.find((question) => question.id === id) ?? null;
};

export const deleteEvalutionQuestion = async (id: number) => {
  const questions = getStoredQuestions();
  saveQuestions(questions.filter((question) => question.id !== id));
};
