// api 전체 응답
export interface ApiResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: T;
}

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

// 배너
export type BannerFileType = "IMAGE" | "VIDEO";

export interface Banner {
    bannerId: number;
    imageUrl: string;
    fileType: BannerFileType;
    linkUrl: string;
    text: string;
}

export type BannerResponse = ApiResponse<Banner[]>;

// 캘린더
export type ScheduleType = "LECTURE_START" | "LECTURE_END" | "TRIP" | "FLIGHT";

export interface Schedule {
    scheduleId: number;
    title: string;
    type: ScheduleType;
    eventDate: string;
    dDayText: string; 
}

export interface ScheduleSidebarProps {
    schedules: Schedule[];
    selectedDate: string;
}

export interface CalendarGridProps {
    year: number;
    month: number;
    schedules: Schedule[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
}