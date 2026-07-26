import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { readPageMeta } from "@/lib/pagination";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getAdminUserDetail } from "@/features/services/adminUserActivity.service";
import {
  EvalutionLevel,
  EvalutionQuestion,
  EvalutionQuestionFormData,
  EvalutionResult,
  EvalutionResultPage,
} from "@/features/contentmanage/evalution/types";

type UnknownRecord = Record<string, unknown>;

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.questions)) return record.questions;
  if (Array.isArray(record.results)) return record.results;

  return [];
};

const getString = (record: UnknownRecord, keys: string[], fallback = "-") => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getNestedRecord = (record: UnknownRecord, keys: string[]) => {
  const value = keys.map((key) => record[key]).find((item) => item !== null && item !== undefined);

  return getRecord(value);
};

const getNumber = (record: UnknownRecord, keys: string[], fallback = 0) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeAnswerIndex = (record: UnknownRecord) => {
  if (record.answerIndex !== undefined || record.correctAnswerIndex !== undefined) {
    return Math.max(0, getNumber(record, ["answerIndex", "correctAnswerIndex"], 0));
  }

  return Math.max(0, getNumber(record, ["correctOption"], 1) - 1);
};

const formatDate = (value: string) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const normalizeResultLevel = (value: string): EvalutionLevel => {
  if (value === "초급" || value === "BEGINNER") return "초급";
  if (value === "고급" || value === "ADVANCED") return "고급";

  return "중급";
};

const normalizeOptions = (record: UnknownRecord) => {
  const options = record.options ?? record.choices ?? record.answers;

  if (Array.isArray(options)) {
    return options.map((option) => String(option));
  }

  return [
    getString(record, ["option1", "choice1"], ""),
    getString(record, ["option2", "choice2"], ""),
    getString(record, ["option3", "choice3"], ""),
    getString(record, ["option4", "choice4"], ""),
  ].filter(Boolean);
};

export const normalizeEvalutionQuestion = (
  item: unknown,
  countryName = "-",
  fallbackId = 0
): EvalutionQuestion => {
  const record = getRecord(item);
  const questionOrder = getNumber(record, ["questionOrder", "order"], fallbackId);

  return {
    id: getNumber(record, ["questionId", "id"], fallbackId),
    countryId: getNumber(record, ["countryId", "country_id"]),
    questionOrder: questionOrder >= 1 ? questionOrder : fallbackId,
    country: getString(record, ["country", "countryName"], countryName),
    title: getString(record, ["title", "question", "questionText", "content"], "-"),
    options: normalizeOptions(record),
    answerIndex: normalizeAnswerIndex(record),
    explanation: getString(record, ["explanation"], ""),
  };
};

export const normalizeEvalutionResult = (
  item: unknown,
  fallbackId = 0
): EvalutionResult => {
  const record = getRecord(item);
  const user = getNestedRecord(record, ["user", "member", "student"]);
  const userId = getNumber(record, ["userId", "memberId"]);
  const userName =
    getString(record, ["name", "userName", "username", "nickname"], "") ||
    getString(user, ["name", "userName", "username", "nickname"], "-");

  return {
    resultId: getNumber(record, ["resultId", "id"], fallbackId),
    userName,
    userId: userId ? `U${String(userId).padStart(4, "0")}` : "-",
    level: normalizeResultLevel(getString(record, ["level", "resultLevel"], "중급")),
    score: getNumber(record, ["score", "totalScore", "correctCount"], 0),
    submittedAt: formatDate(getString(record, ["submittedAt", "createdAt"], "")),
  };
};

export const getEvalutionQuestions = async (
  countryId: number,
  countryName = "-",
  signal?: AbortSignal
): Promise<EvalutionQuestion[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/diagnosis/questions",
    {
      params: { countryId },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return getItems(data).map((item, index) =>
    normalizeEvalutionQuestion(item, countryName, index + 1)
  );
};

export const getEvalutionQuestion = async (
  id: number,
  signal?: AbortSignal
): Promise<EvalutionQuestion | null> => {
  const countries = await getCourseCountries(signal);
  const questionGroups = await Promise.all(
    countries.map((country) =>
      getEvalutionQuestions(country.countryId, country.countryName, signal)
    )
  );
  const questions = questionGroups.flat();

  return questions.find((question) => question.id === id) ?? null;
};

export const getEvalutionResults = async (
  params: { page: number; size: number },
  signal?: AbortSignal
): Promise<EvalutionResultPage> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/diagnosis/results",
    {
      params: { page: params.page, size: params.size },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const items = getItems(data);
  const meta = readPageMeta(data, items.length);
  const results = items.map((item, index) =>
    normalizeEvalutionResult(item, index + 1)
  );

  const toPage = (rows: EvalutionResult[]): EvalutionResultPage => ({
    results: rows,
    page: meta.page,
    totalPages: meta.totalPages,
    totalElements: meta.totalElements,
  });

  const missingUserIds = results
    .filter((result) => result.userName === "-" && result.userId !== "-")
    .map((result) => Number(result.userId.replace(/^U/, "")))
    .filter((userId) => Number.isSafeInteger(userId) && userId > 0);

  if (missingUserIds.length === 0) return toPage(results);

  try {
    const users = await Promise.all(
      Array.from(new Set(missingUserIds)).map(async (userId) => {
        const user = getRecord(await getAdminUserDetail(userId, { signal }));
        const userName = getString(user, ["name", "nickname", "userName", "username"], "-");

        return [userId, userName] as const;
      })
    );
    const userNameMap = new Map(users);

    return toPage(
      results.map((result) => {
        const userId = Number(result.userId.replace(/^U/, ""));
        const userName = userNameMap.get(userId);

        return userName && userName !== "-" ? { ...result, userName } : result;
      })
    );
  } catch {
    return toPage(results);
  }
};

export const createEvalutionQuestion = async (
  payload: EvalutionQuestionFormData
) => {
  const request = toDiagnosisQuestionRequest(payload);
  const response = await adminApi.post<ApiResult<unknown>>(
    "/api/v1/admin/diagnosis/questions",
    request,
    { suppressGlobalError: true }
  );

  return normalizeEvalutionQuestion(unwrapData(response), payload.country);
};

export const updateEvalutionQuestion = async (
  id: number,
  payload: EvalutionQuestionFormData
) => {
  const request = toDiagnosisQuestionRequest(payload);
  const response = await adminApi.put<ApiResult<unknown>>(
    `/api/v1/admin/diagnosis/questions/${id}`,
    request,
    { suppressGlobalError: true }
  );

  return normalizeEvalutionQuestion(unwrapData(response), payload.country, id);
};

export const deleteEvalutionQuestion = async (id: number) => {
  await adminApi.delete<ApiResult<null>>(
    `/api/v1/admin/diagnosis/questions/${id}`,
    { suppressGlobalError: true }
  );
};

const toDiagnosisQuestionRequest = (payload: EvalutionQuestionFormData) => ({
  countryId: payload.countryId,
  questionText: payload.title,
  option1: payload.options[0] ?? "",
  option2: payload.options[1] ?? "",
  option3: payload.options[2] ?? "",
  option4: payload.options[3] ?? "",
  correctOption: payload.answerIndex + 1,
  explanation: payload.explanation,
  questionOrder: payload.questionOrder,
  active: true,
});
