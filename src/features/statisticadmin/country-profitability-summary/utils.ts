export const formatPercent = (value: number) => {
    return `${value.toLocaleString()}%`;
};

export const formatHundredMillion = (value: number) => {
  return `${(value / 100000000).toFixed(1)}억`;
};

export const formatBookingCount = (value: number) => {
  return value.toLocaleString();
};

export const getRateTextColor = (value: number) => {
  if (value >= 6) return "text-[#EF4444]";
  if (value >= 5) return "text-[#F59E0B]";
  return "text-[#667085]";
};
