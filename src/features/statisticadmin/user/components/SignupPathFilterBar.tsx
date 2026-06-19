import Image from "next/image";

type SignupPathFilterBarProps = {
  pathOptions: { value: string; label: string }[];
  selectedPath: string;
  searchKeyword: string;
  onSelectedPathChange: (value: string) => void;
  onSearchKeywordChange: (value: string) => void;
};

export default function SignupPathFilterBar({
  pathOptions,
  selectedPath,
  searchKeyword,
  onSelectedPathChange,
  onSearchKeywordChange,
}: SignupPathFilterBarProps) {
  return (
    <section
      className="mb-5 flex items-center justify-between gap-4 rounded-[16px] border border-[#E4E7EC] bg-white p-4"
      aria-label="유저 유입 경로 필터"
    >
      <div className="flex items-center gap-2">
        <span className="mr-2 text-[14px] font-semibold text-[#344054]">
          유입 경로
        </span>
        {pathOptions.map((option) => {
          const isSelected = selectedPath === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectedPathChange(option.value)}
              className={`h-[34px] rounded-[9px] px-4 text-[13px] font-semibold ${
                isSelected
                  ? "bg-[#439A97] text-white"
                  : "border border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#F5F7FA]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className="flex h-[40px] w-[320px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
        <span className="sr-only">유입 경로 검색</span>
        <Image src="/images/search.svg" alt="" aria-hidden width={16} height={16} />
        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="유입 경로 검색"
          className="w-full rounded-[6px] text-[14px] outline-none placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#639E9B]"
        />
      </label>
    </section>
  );
}
