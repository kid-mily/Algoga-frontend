export const formatCalendarDate = (
    year: number,
    month: number,
    date: number
) => {
    return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
};

export const getMonthStartDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};