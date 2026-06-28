export type MainNoticeBadgeColor = "blue" | "indigo" | "gray";

export interface MainNoticeItem {
    noticeId: number;
    category: string;
    title: string;
    date: string;
    color: MainNoticeBadgeColor;
}