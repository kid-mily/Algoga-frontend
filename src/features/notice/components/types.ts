export type NoticeType = "ALL" | "NOTICE" | "EVENT" | "MAINTENANCE";

export type NoticeCategory = Exclude<NoticeType, "ALL">;

// 공지
// 공지 유형 정의 (오타 방지 및 타입 안정성 확보)
export type NoticeTag = "EVENT" | "NOTICE" | "MAINTENANCE";

export interface Notice {
    noticeId: number;
    tag: NoticeTag;
    title: string;
    date: string;
    time: string;
}

export interface NoticeAll {
  noticeId: number;
  type: NoticeCategory;
  title: string;
  date: string;
}

export interface NoticePageResult {
  content: NoticeAll[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface NoticeDetail {
  noticeId: number;
  managerId: number;
  tag: NoticeCategory;
  title: string;
  content: string;
  createdAt: string;
}

export interface NoticeNavigation {
  noticeId: number;
  title: string;
}

export interface NoticeNavigationResult {
  previousNotice: NoticeNavigation | null;
  nextNotice: NoticeNavigation | null;
}

export const noticeTypes: NoticeType[] = [
  "ALL",
  "NOTICE",
  "EVENT",
  "MAINTENANCE",
];

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

export const isNoticeType = (value?: string): value is NoticeType => {
  return noticeTypes.includes(value as NoticeType);
};

export const emptyNoticePageResult: NoticePageResult = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};