import { ChevronLeft } from "lucide-react";
import { CONTINENT_NAME_KO } from "../constants/mapConstants";

interface MapHeaderProps {
  selectedContinent: string;
  selectedCountry: string;
  onReset: () => void;
}

export default function MapHeader({
  selectedContinent,
  selectedCountry,
  onReset,
}: MapHeaderProps) {
  const title = !selectedContinent
    ? "어디로 떠나시나요?"
    : selectedCountry
      ? selectedCountry
      : `${CONTINENT_NAME_KO[selectedContinent] ?? selectedContinent} 국가 선택`;

  return (
    <div className="absolute left-5 top-5 z-[1000] flex items-start gap-3">
      {selectedContinent ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/95 text-[#5E9F9B] shadow-md backdrop-blur-sm transition hover:bg-[#F3FBFA]"
          aria-label="대륙 선택으로 돌아가기"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      ) : null}

      <div className="rounded-[18px] border border-white/80 bg-white/90 px-5 py-4 shadow-md backdrop-blur-sm">
        <p className="text-[10px] font-bold tracking-[0.14em] text-[#439A97]">
          SELECT DESTINATION
        </p>

        <p className="mt-2 text-base font-bold text-[#0A1628]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#8A94A6]">
          {selectedContinent
            ? "국가를 선택하면 강의실로 이동합니다."
            : "국가를 선택하면 맞춤 강의를 확인할 수 있어요."}
        </p>
      </div>
    </div>
  );
}