export interface Notice {
    noticeId: number
    tag: string
    title: string
    date: string
    time: string
}

export interface Banner {
    bannerId: string,
    imageUrl: string,
    fileType: string,
    linkUrl: string,
    text: string
}

export interface Schedule {
    scheduleId: number;
    title: string;
    type: string;
    eventDate: string;
    dDayText: string; 
}