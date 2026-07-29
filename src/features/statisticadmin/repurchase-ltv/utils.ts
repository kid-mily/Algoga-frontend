export const repurchaseLtvPeriods = ["TODAY", "THIS_WEEK", "THIS_MONTH", "THIS_YEAR"] as const;

export type RepurchaseLtvPeriod = (typeof repurchaseLtvPeriods)[number];

export const repurchaseLtvPeriodLabels: Record<RepurchaseLtvPeriod, string> = {
  TODAY: "오늘",
  THIS_WEEK: "이번주",
  THIS_MONTH: "이번달",
  THIS_YEAR: "올해",
};

export const formatPercent = (value: number) => `${value.toLocaleString()}%`;

export const formatWon = (value: number) => `${value.toLocaleString()}원`;

export const formatManwon = (value: number) =>
  `${Math.round(value / 10000).toLocaleString()}만원`;

export const getCohortCellClassName = (value?: number | null) => {
  if (value === null || value === undefined) return "bg-[#F2F4F7] text-[#C0C7D0]";
  if (value >= 80) return "bg-[#1BA88F] text-white";
  if (value >= 40) return "bg-[#32B89F] text-white";
  if (value >= 25) return "bg-[#67CDBA] text-white";
  return "bg-[#B9E4DD] text-[#357F7C]";
};

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

export const getRepurchaseLtvDateRange = (period: RepurchaseLtvPeriod) => {
  const now = new Date();
  const from = new Date(now);

  if (period === "TODAY") {
    return {
      from: toDateInputValue(now),
      to: toDateInputValue(now),
    };
  }

  if (period === "THIS_WEEK") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + mondayOffset);
  }

  if (period === "THIS_MONTH") {
    from.setDate(1);
  }

  if (period === "THIS_YEAR") {
    from.setMonth(0, 1);
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(now),
  };
};
