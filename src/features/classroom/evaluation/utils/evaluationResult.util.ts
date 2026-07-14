import type { DiagnosisLevel } from "../types";

export const toContinentPathCode = (continentCode: string) =>
  continentCode.trim().toLowerCase();

export const formatPrice = (price: number) => {
  if (price === 0) return "무료";
  return `${price.toLocaleString("ko-KR")}원`;
};

export const LEVEL_STYLES: Record<
  DiagnosisLevel,
  {
    label: string;
    background: string;
    text: string;
    border: string;
    accent: string;
  }
> = {
  BEGINNER: {
    label: "초급",
    background: "bg-[#EAF7F6]",
    text: "text-[#357A78]",
    border: "border-[#BFE4E0]",
    accent: "bg-[#439A97]",
  },
  INTERMEDIATE: {
    label: "중급",
    background: "bg-[#FFF4DF]",
    text: "text-[#A56B16]",
    border: "border-[#F1D39A]",
    accent: "bg-[#D6A640]",
  },
  ADVANCED: {
    label: "고급",
    background: "bg-[#FDECEC]",
    text: "text-[#B54747]",
    border: "border-[#F2C4C4]",
    accent: "bg-[#D96A5B]",
  },
};

export const getCourseLevelStyle = (level?: DiagnosisLevel) => {
  const fallback = LEVEL_STYLES.INTERMEDIATE;

  if (!level) {
    return fallback;
  }

  return LEVEL_STYLES[level] ?? fallback;
};
