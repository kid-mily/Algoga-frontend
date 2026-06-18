import type { CourseCountry } from "@/features/contentmanage/lecture/types";

type EvalutionFilterBarProps = {
  countries: CourseCountry[];
  selectedCountryId: number | null;
  onSelectedCountryChange: (countryId: number | null) => void;
  onCreateClick: () => void;
};

export default function EvalutionFilterBar({
  countries,
  selectedCountryId,
  onSelectedCountryChange,
  onCreateClick,
}: EvalutionFilterBarProps) {
  return (
    <section className="border-b border-[#EEF0F3] px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[14px] font-medium text-[#344054]">
          국가별 5문항 세트를 관리합니다
        </p>

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

        {countries.length === 0 ? (
          <span className="text-[13px] text-[#98A2B3]">등록된 국가가 없습니다.</span>
        ) : countries.map((country) => {
          const isSelected = country.countryId === selectedCountryId;

          return (
            <button
              key={country.countryId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectedCountryChange(country.countryId)}
              className={`rounded-full border px-3 py-1.5 text-[12px] ${
                isSelected
                  ? "border-[#439A97] bg-[#439A97] text-white"
                  : "border-[#E4E7EC] bg-white text-[#344054]"
              }`}
            >
              {country.countryName}
            </button>
          );
        })}
      </div>
    </section>
  );
}
