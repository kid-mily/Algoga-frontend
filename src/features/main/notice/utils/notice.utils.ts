import type { MainNoticeBadgeColor, MainNoticeItem, MainNoticeSourceNotice } from "../types";

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

const getFallbackCategory = (tag: string) => {
    return tag.trim() || "공지";
};

export const getMainNoticeViewModel = (
    notice: MainNoticeSourceNotice
): MainNoticeItem => {
    const config = mainNoticeTagConfig[notice.tag];

    return {
        noticeId: notice.noticeId,
        category: config?.label ?? getFallbackCategory(notice.tag),
        title: notice.title,
        date: notice.date,
        color: config?.color ?? "gray",
    };
};