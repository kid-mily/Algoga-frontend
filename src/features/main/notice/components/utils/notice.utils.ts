import type { Notice } from "@/features/notice/components/types";
import type { MainNoticeBadgeColor, MainNoticeItem } from "../../types";

export const mainNoticeTagConfig: Record<
  string,
  {
    label: string;
    color: MainNoticeBadgeColor;
  }
> = {
  EVENT: {
    label: "이벤트",
    color: "blue",
  },
  NOTICE: {
    label: "공지",
    color: "gray",
  },
  MAINTENANCE: {
    label: "점검",
    color: "indigo",
  },
};

export const getMainNoticeViewModel = (
  notice: Notice
): MainNoticeItem | null => {
  const config = mainNoticeTagConfig[notice.tag];

  if (!config) return null;

  return {
    noticeId: notice.noticeId,
    category: config.label,
    title: notice.title,
    date: notice.date,
    color: config.color,
  };
};
