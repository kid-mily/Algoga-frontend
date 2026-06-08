import Link from "next/link";

type LectureToolbarProps = {
  searchKeyword: string;
  countryFilter: string;
  statusFilter: string;
  countryOptions: string[];
  onSearchKeywordChange: (value: string) => void;
  onCountryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

export default function LectureToolbar({
  searchKeyword,
  countryFilter,
  statusFilter,
  countryOptions,
  onSearchKeywordChange,
  onCountryFilterChange,
  onStatusFilterChange,
}: LectureToolbarProps) {
  return (
    <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
          <img src="/images/search.svg" alt="검색" className="h-[15px] w-[15px]" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            placeholder="강의 제목 검색..."
            className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <select
          value={countryFilter}
          onChange={(e) => onCountryFilterChange(e.target.value)}
          className="h-[42px] w-[120px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
        >
          <option value="all">전체 국가</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-[42px] w-[100px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
        >
          <option value="all">전체</option>
          <option value="public">공개</option>
          <option value="private">비공개</option>
        </select>

        <Link
          href="/contentadmin/lecture/new"
          className="flex h-[42px] items-center whitespace-nowrap rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
        >
          + 강의 등록
        </Link>
      </div>
    </div>
  );
}