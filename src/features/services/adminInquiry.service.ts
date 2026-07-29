import { adminApi, ApiRequestError, ApiResult, unwrapData } from "@/lib/api";
import {
  CsInquiry,
  CsInquiryCategoryCode,
  CsInquiryCategoryFilter,
  CsInquiryPage,
  CsInquiryStatusCode,
  CsInquiryStatusFilter,
  InquiryAdminResponse,
  InquiryPageResponse,
} from "@/features/csadmin/inquiry/types";

const categoryLabel: Record<CsInquiryCategoryCode, CsInquiry["type"]> = {
  RESERVATION: "예약",
  REFUND: "환불",
  COURSE: "강의",
  ETC: "기타",
};

const statusLabel: Record<CsInquiryStatusCode, CsInquiry["status"]> = {
  PENDING: "미처리",
  ANSWERED: "답변 완료",
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

const getInquiryWriter = (item: InquiryAdminResponse) =>
  item.userNickname ?? item.userName ?? "(알 수 없음)";

const normalizeInquiry = (item: InquiryAdminResponse): CsInquiry => ({
  id: `INQ${String(item.inquiryId).padStart(3, "0")}`,
  inquiryId: item.inquiryId,
  userId: item.userId,
  userName: item.userName,
  userNickname: item.userNickname,
  writer: getInquiryWriter(item),
  category: item.category,
  type: categoryLabel[item.category] ?? "기타",
  title: item.title,
  content: item.content,
  answer: item.answer,
  date: formatDateTime(item.createdAt),
  answeredAt: item.answeredAt ? formatDateTime(item.answeredAt) : null,
  statusCode: item.status,
  status: statusLabel[item.status] ?? "미처리",
});

const normalizePage = (pageData: InquiryPageResponse): CsInquiryPage => ({
  inquiries: Array.isArray(pageData.content)
    ? pageData.content.map(normalizeInquiry)
    : [],
  page: pageData.page ?? 0,
  size: pageData.size ?? 8,
  totalElements: pageData.totalElements ?? 0,
  totalPages: pageData.totalPages ?? 1,
  first: pageData.first ?? true,
  last: pageData.last ?? true,
});

type GetAdminInquiriesParams = {
  category?: CsInquiryCategoryFilter;
  status?: CsInquiryStatusFilter;
  page?: number;
  signal?: AbortSignal;
};

export const getAdminInquiries = async ({
  category = "ALL",
  status = "ALL",
  page = 0,
  signal,
}: GetAdminInquiriesParams = {}): Promise<CsInquiryPage> => {
  const response = await adminApi.get<ApiResult<InquiryPageResponse>>(
    "/api/v1/admin/inquiries",
    {
      params: {
        category,
        status,
        page,
      },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return normalizePage(data);
};

export const answerAdminInquiry = async (
  inquiryId: number,
  answer: string
): Promise<void> => {
  await adminApi.put<ApiResult<null>>(
    `/api/v1/admin/inquiries/${inquiryId}/answer`,
    { answer }
  );
};

export const getAdminInquiryById = async (
  inquiryId: number,
  signal?: AbortSignal
): Promise<CsInquiry | null> => {
  try {
    const response = await adminApi.get<ApiResult<InquiryAdminResponse>>(
      `/api/v1/admin/inquiries/${inquiryId}`,
      {
        suppressGlobalError: true,
        signal,
      }
    );

    return normalizeInquiry(unwrapData(response));
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

