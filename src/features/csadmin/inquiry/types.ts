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

export const mockCsInquiries: CsInquiry[] = [
  {
    id: "INQ001",
    inquiryId: 1,
    userId: 1,
    writer: "김여행",
    category: "RESERVATION",
    type: "예약",
    title: "예약 변경 문의드립니다",
    content: "예약 날짜를 다음 주로 변경할 수 있는지 확인 부탁드립니다.",
    answer: null,
    date: "2024.06.08 14:30",
    answeredAt: null,
    statusCode: "PENDING",
    status: "미처리",
  },
  {
    id: "INQ002",
    inquiryId: 2,
    userId: 2,
    writer: "이투어",
    category: "REFUND",
    type: "환불",
    title: "환불 처리 언제 되나요?",
    content: "취소 신청 후 환불 진행 상태가 궁금합니다.",
    answer: null,
    date: "2024.06.08 13:20",
    answeredAt: null,
    statusCode: "PENDING",
    status: "미처리",
  },
  {
    id: "INQ003",
    inquiryId: 3,
    userId: 3,
    writer: "박트립",
    category: "COURSE",
    type: "강의",
    title: "강의 수강 기간 연장 문의",
    content: "개인 사정으로 수강 기간 연장이 가능한지 문의드립니다.",
    answer: null,
    date: "2024.06.08 12:15",
    answeredAt: null,
    statusCode: "PENDING",
    status: "미처리",
  },
  {
    id: "INQ004",
    inquiryId: 4,
    userId: 4,
    writer: "최여행",
    category: "ETC",
    type: "기타",
    title: "쿠폰 적용이 안 됩니다",
    content: "결제 화면에서 보유 쿠폰이 적용되지 않습니다.",
    answer: "쿠폰 사용 조건과 유효기간을 확인해 주세요.",
    date: "2024.06.08 11:40",
    answeredAt: "2024.06.08 12:10",
    statusCode: "ANSWERED",
    status: "답변 완료",
  },
  {
    id: "INQ005",
    inquiryId: 5,
    userId: 5,
    writer: "정트래블",
    category: "RESERVATION",
    type: "예약",
    title: "패키지 상품 문의",
    content: "패키지 상품에 포함된 숙소 정보를 알고 싶습니다.",
    answer: "상품 상세 페이지에서 숙소 정보를 확인하실 수 있습니다.",
    date: "2024.06.08 10:25",
    answeredAt: "2024.06.08 11:00",
    statusCode: "ANSWERED",
    status: "답변 완료",
  },
  {
    id: "INQ006",
    inquiryId: 6,
    userId: 6,
    writer: "강여행자",
    category: "COURSE",
    type: "강의",
    title: "수료증 발급 문의",
    content: "수료 완료 후 수료증을 어디서 받을 수 있나요?",
    answer: "내 강의실의 수료 내역에서 발급 가능합니다.",
    date: "2024.06.08 09:50",
    answeredAt: "2024.06.08 10:20",
    statusCode: "ANSWERED",
    status: "답변 완료",
  },
  {
    id: "INQ007",
    inquiryId: 7,
    userId: 7,
    writer: "윤투어",
    category: "REFUND",
    type: "환불",
    title: "부분 환불 가능한가요?",
    content: "패키지 중 일부만 취소하고 부분 환불을 받고 싶습니다.",
    answer: null,
    date: "2024.06.07 18:30",
    answeredAt: null,
    statusCode: "PENDING",
    status: "미처리",
  },
  {
    id: "INQ008",
    inquiryId: 8,
    userId: 8,
    writer: "송여행",
    category: "RESERVATION",
    type: "예약",
    title: "단체 예약 할인 문의",
    content: "5명 이상 단체 예약 시 할인이 가능한지 문의드립니다.",
    answer: "단체 예약 할인은 고객센터 확인 후 적용됩니다.",
    date: "2024.06.07 16:15",
    answeredAt: "2024.06.07 17:00",
    statusCode: "ANSWERED",
    status: "답변 완료",
  },
];
