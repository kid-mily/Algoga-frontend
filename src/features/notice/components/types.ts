// 공지사항 필터 유형
export type NoticeType =
  | "ALL"
  | "NOTICE"
  | "EVENT"
  | "MAINTENANCE";

// 실제 공지 데이터에 들어오는 유형
// ALL은 목록 필터에서만 사용하므로 제외
export type NoticeCategory = Exclude<NoticeType, "ALL">;

// 공지사항 목록 조회 데이터
// 목록 API에서는 공지 유형이 type으로 내려옴
export interface NoticeAll {
  noticeId: number;
  type: NoticeCategory;
  title: string;
  date: string;
}

// 공지사항 상세 조회 데이터
// 상세 API에서는 공지 유형이 tag로 내려옴
export interface NoticeDetail {
  noticeId: number;
  managerId: number;
  tag: NoticeCategory;
  title: string;
  content: string;
  createdAt: string;
}

// 이전 글과 다음 글에 사용하는 데이터
export interface NoticeNavigation {
  noticeId: number;
  title: string;
}

// 이전 글과 다음 글 조회 결과
export interface NoticeNavigationResult {
  previousNotice: NoticeNavigation | null;
  nextNotice: NoticeNavigation | null;
}

// 공지사항 필터 목록
export const noticeTypes: NoticeType[] = [
  "ALL",
  "NOTICE",
  "EVENT",
  "MAINTENANCE",
];

// 공지 유형별 화면 표시 설정
export const noticeTypeConfig: Record<
  NoticeType,
  {
    label: string;
    color: "gray" | "blue" | "indigo";
    style: string;
  }
> = {
  ALL: {
    label: "전체",
    color: "gray",
    style: "bg-gray-100 text-gray-600",
  },
  NOTICE: {
    label: "공지",
    color: "gray",
    style: "bg-gray-100 text-gray-600",
  },
  EVENT: {
    label: "이벤트",
    color: "blue",
    style: "bg-blue-50 text-blue-600",
  },
  MAINTENANCE: {
    label: "점검",
    color: "indigo",
    style: "bg-indigo-50 text-indigo-600",
  },
};

// URL에서 받은 값이 올바른 공지 유형인지 확인
export const isNoticeType = (
  value?: string
): value is NoticeType => {
  return noticeTypes.includes(value as NoticeType);
};