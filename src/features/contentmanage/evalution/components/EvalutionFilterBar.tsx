import {
  evalutionCountries,
  EvalutionLevel,
  evalutionLevels,
} from "../types";

type EvalutionFilterBarProps = {
  selectedLevel: EvalutionLevel | "전체";
  selectedCountry: string;
  onSelectedLevelChange: (level: EvalutionLevel | "전체") => void;
  onSelectedCountryChange: (country: string) => void;
  onCreateClick: () => void;
};

export default function EvalutionFilterBar({
  selectedLevel,
  selectedCountry,
  onSelectedLevelChange,
  onSelectedCountryChange,
  onCreateClick,
}: EvalutionFilterBarProps) {
  return (
    <section className="border-b border-[#EEF0F3] px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div
          role="group"
          aria-label="난이도 필터"
          className="flex items-center gap-2"
        >
          <span className="mr-2 text-[14px] font-medium text-[#344054]">
            난이도
          </span>

          {(["전체", ...evalutionLevels] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelectedLevelChange(item)}
              className={`rounded-full border px-4 py-2 text-[13px] ${
                item === selectedLevel
                  ? "border-[#439A97] bg-[#439A97] text-white"
                  : "border-[#E4E7EC] bg-white text-[#344054]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-[10px] bg-[#6FA8A5] px-5 py-3 text-[14px] font-semibold text-white"
        >
          <span aria-hidden="true" className="text-[18px] leading-none">
            +
          </span>
          문제 등록
        </button>
      </div>

      <div
        role="group"
        aria-label="국가 필터"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="mr-2 text-[14px] font-medium text-[#344054]">
          국가
        </span>

        {["전체", ...evalutionCountries].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelectedCountryChange(item)}
            className={`rounded-full border px-3 py-1.5 text-[12px] ${
              item === selectedCountry
                ? "border-[#439A97] bg-[#439A97] text-white"
                : "border-[#E4E7EC] bg-white text-[#344054]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
