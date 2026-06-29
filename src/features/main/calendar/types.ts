export type ScheduleType =
    | "LECTURE_START"
    | "LECTURE_END"
    | "TRIP"
    | "FLIGHT"
    | "HOTEL";

export interface Schedule {
    scheduleId: number;
    title: string;
    type: ScheduleType;
    eventDate: string;
    dDayText: string;
}

export interface CalendarGridProps {
    year: number;
    month: number;
    schedules: Schedule[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export interface ScheduleSidebarProps {
    schedules: Schedule[];
    selectedDate: string;
    isLoggedIn?: boolean;
    isAuthChecked?: boolean;
    isLoading?: boolean;
    error?: string | null;
}