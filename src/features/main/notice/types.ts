export type MainNoticeBadgeColor = "blue" | "indigo" | "gray";

export interface MainNoticeSourceNotice {
    noticeId: number;
    tag: string;
    title: string;
    date: string;
}

export interface MainNoticeItem {
    noticeId: number;
    category: string;
    title: string;
    date: string;
    color: MainNoticeBadgeColor;
}