"use client";

type BannerToolbarProps = {
  searchKeyword: string;
  visibilityFilter: "ALL" | "VISIBLE" | "HIDDEN";
  onSearchKeywordChange: (value: string) => void;
  onVisibilityFilterChange: (value: "ALL" | "VISIBLE" | "HIDDEN") => void;
};

export default function BannerToolbar({
  searchKeyword,
  visibilityFilter,
  onSearchKeywordChange,
  onVisibilityFilterChange,
}: BannerToolbarProps) {
  return (
    <form role="search" className="mb-6 flex flex-wrap items-center gap-3 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <label htmlFor="banner-search" className="sr-only">
        배너 검색
      </label>
      <input
        id="banner-search"
        value={searchKeyword}
        onChange={(event) => onSearchKeywordChange(event.target.value)}
        placeholder="배너 문구 또는 URL 검색"
        className="h-[42px] min-w-0 flex-1 rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
      />

      
      <select
        id="banner-visibility-filter"
        value={visibilityFilter}
        onChange={(event) =>
          onVisibilityFilterChange(event.target.value as "ALL" | "VISIBLE" | "HIDDEN")
        }
        className="h-[42px] min-w-0 flex-1 rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B] sm:max-w-[140px]"
      >
        <option value="ALL">전체</option>
        <option value="VISIBLE">노출</option>
        <option value="HIDDEN">숨김</option>
      </select>
    </form>
  );
}
