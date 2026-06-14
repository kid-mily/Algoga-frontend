export type NoticeTag = "ALL" | "NOTICE" | "EVENT" | "MAINTENANCE" | string;

export type AdminNoticeApiRecord = Partial<{
  noticeId: number;
  id: number;
  title: string;
  content: string;
  tag: NoticeTag;
  type: NoticeTag;
  createdAt: string;
  created_at: string;
  createdDate: string;
  created_date: string;
  registeredAt: string;
  registered_at: string;
  date: string;
  updatedAt: string;
  updated_at: string;
  updatedDate: string;
  updated_date: string;
  viewCount: number;
}>;

export type AdminNotice = {
  noticeId: number;
  displayId: string;
  title: string;
  content: string;
  tag: NoticeTag;
  tagLabel: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
};

export type NoticeFormData = {
  title: string;
  content: string;
  tag: NoticeTag;
};

export type NoticeTagOption = {
  value: NoticeTag;
  label: string;
};

export const noticeTagOptions: NoticeTagOption[] = [
  { value: "NOTICE", label: "공지" },
  { value: "EVENT", label: "이벤트" },
  { value: "MAINTENANCE", label: "점검" },
];

export const noticeFilterOptions = [
  { value: "ALL", label: "전체" },
  ...noticeTagOptions,
];

export const getNoticeTagLabel = (tag: NoticeTag) => {
  return noticeTagOptions.find((option) => option.value === tag)?.label ?? "공지";
};

export const emptyNoticeForm: NoticeFormData = {
  title: "",
  content: "",
  tag: "NOTICE",
};
