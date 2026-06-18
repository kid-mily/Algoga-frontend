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

export const evalutionCountries = [
  "남아프리카공화국",
  "콩고민주공화국",
  "이집트",
  "대한민국",
  "남극",
  "캐나다",
  "프랑스",
  "일본",
];
