export type EvalutionLevel = "초급" | "중급" | "고급";

export type EvalutionQuestion = {
  id: number;
  countryId: number;
  questionOrder: number;
  country: string;
  title: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type EvalutionResult = {
  resultId: number;
  userName: string;
  userId: string;
  level: EvalutionLevel;
  score: number;
  submittedAt: string;
};

export type EvalutionQuestionSet = {
  id: number;
  countryId: number;
  country: string;
  questions: EvalutionQuestion[];
};

export type EvalutionQuestionFormData = {
  id?: number;
  countryId: number;
  questionOrder: number;
  country: string;
  title: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};
