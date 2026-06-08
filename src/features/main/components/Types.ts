// 공지
export interface Notice {
    noticeId: number
    tag: string
    title: string
    date: string
    time: string
}

// 배너
export interface Banner {
    bannerId: string,
    imageUrl: string,
    fileType: string,
    linkUrl: string,
    text: string
}

// 캘린더
export interface Schedule {
    scheduleId: number;
    title: string;
    type: string;
    eventDate: string;
    dDayText: string; 
}

export interface ScheduleSidebarProps {
    schedules: Schedule[]
}

export interface CalendarGridProps {
    year: number
    month: number
    schedules: Schedule[]
}