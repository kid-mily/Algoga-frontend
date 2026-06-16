export type CsInquiryStatusCode = "PENDING" | "ANSWERED";
export type CsInquiryCategoryCode = "RESERVATION" | "REFUND" | "COURSE" | "ETC";
export type CsInquiryStatus = "미처리" | "답변 완료";
export type CsInquiryType = "예약" | "환불" | "강의" | "기타";

export type CsInquiry = {
  id: string;
  inquiryId: number;
  userId: number;
  writer: string;
  category: CsInquiryCategoryCode;
  type: CsInquiryType;
  title: string;
  content: string;
  answer: string | null;
  date: string;
  answeredAt: string | null;
  statusCode: CsInquiryStatusCode;
  status: CsInquiryStatus;
};

export type CsInquiryStatusFilter = CsInquiryStatusCode | "ALL";
export type CsInquiryCategoryFilter = CsInquiryCategoryCode | "ALL";

export type CsInquiryPage = {
  inquiries: CsInquiry[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type InquiryAdminResponse = {
  inquiryId: number;
  userId: number;
  category: CsInquiryCategoryCode;
  title: string;
  content: string;
  answer: string | null;
  status: CsInquiryStatusCode;
  createdAt: string;
  answeredAt: string | null;
};

export type InquiryPageResponse = {
  content: InquiryAdminResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export const csInquiryStatusFilters: Array<{
  code: CsInquiryStatusFilter;
  label: string;
}> = [
  { code: "ALL", label: "전체상태" },
  { code: "PENDING", label: "미처리" },
  { code: "ANSWERED", label: "답변 완료" },
];

export const csInquiryCategoryFilters: Array<{
  code: CsInquiryCategoryFilter;
  label: string;
}> = [
  { code: "ALL", label: "전체유형" },
  { code: "RESERVATION", label: "예약" },
  { code: "REFUND", label: "환불" },
  { code: "COURSE", label: "강의" },
  { code: "ETC", label: "기타" },
];


