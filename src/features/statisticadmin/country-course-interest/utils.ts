import type { CompletionStatus, InterestPeriod } from "./types";

export const interestPeriods: InterestPeriod[] = ["today", "week", "month", "year"];

export const interestPeriodLabels: Record<InterestPeriod, string> = {
  today: "오늘",
  week: "이번주",
  month: "이번달",
  year: "올해",
};

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

// country-profit API의 from/to는 필수라 선택된 기간을 그대로 넘깁니다.
export const getInterestDateRange = (period: InterestPeriod) => {
  const now = new Date();
  const from = new Date(now);

  if (period === "today") {
    return { from: toDateInputValue(now), to: toDateInputValue(now) };
  }

  if (period === "week") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + mondayOffset);
  }

  if (period === "month") {
    from.setDate(1);
  }

  if (period === "year") {
    from.setMonth(0, 1);
  }

  return { from: toDateInputValue(from), to: toDateInputValue(now) };
};

// 백엔드 기준: NORMAL 60%↑ / WARNING 30~59% / RISK 30% 미만
export const getCompletionStatusStyle = (status: CompletionStatus) => {
  if (status === "RISK") {
    return {
      label: "점검필요",
      className: "bg-[#FEEEEE] text-[#EF4444]",
      valueClassName: "text-[#EF4444]",
    };
  }

  if (status === "WARNING") {
    return {
      label: "주의",
      className: "bg-[#FFF4D8] text-[#F59E0B]",
      valueClassName: "text-[#F59E0B]",
    };
  }

  return {
    label: "",
    className: "",
    valueClassName: "text-[#2FAE9B]",
  };
};
