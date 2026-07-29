import type { BalancePeriod } from "./types";

export const formatWon = (value: number) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

export const balancePeriods: BalancePeriod[] = [
  "today",
  "thisWeek",
  "thisMonth",
  "thisYear",
];

export const balancePeriodLabels: Record<BalancePeriod, string> = {
  today: "오늘",
  thisWeek: "이번주",
  thisMonth: "이번달",
  thisYear: "올해",
};

export const getBalanceDateRange = (period: BalancePeriod) => {
  const now = new Date();
  const from = new Date(now);

  if (period === "today") {
    return {
      from: toDateInputValue(now),
      to: toDateInputValue(now),
    };
  }

  if (period === "thisWeek") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + mondayOffset);
  }

  if (period === "thisMonth") {
    from.setDate(1);
  }

  if (period === "thisYear") {
    from.setMonth(0, 1);
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(now),
  };
};

export const formatDisplayDate = (value: string) => {
  if (!value) return "-";
  return value.replaceAll("-", ".");
};

export const getDDayLabel = (dDay: number) => {
  if (dDay < 0) return `D${dDay}`;
  if (dDay === 0) return "D-day";
  return `D+${dDay}`;
};

export const getDDayClassName = (dDay: number) => {
  if (dDay < 0) return "bg-[#FEEEEE] text-[#EF4444]";
  if (dDay <= 7) return "bg-[#FFF4D8] text-[#F59E0B]";
  return "bg-[#F2F4F7] text-[#667085]";
};
