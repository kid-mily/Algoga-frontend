import Link from "next/link";
import { LectureToolbarProps } from "../types";

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
    <form
      role="search"
      aria-label="강의 검색 및 필터"
      className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-wrap gap-3">
        <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
          <img
            src="/images/search.svg"
            alt="검색"
            aria-hidden="true"
            className="h-[15px] w-[15px]"
          />
          <label htmlFor="lecture-search" className="sr-only">
            강의 검색
          </label>
          <input
            id="lecture-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="강의 제목 검색"
            className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <label htmlFor="lecture-country-filter" className="sr-only">
          국가 필터
        </label>
        <select
          id="lecture-country-filter"
          value={countryFilter}
          onChange={(event) => onCountryFilterChange(event.target.value)}
          aria-label="국가 필터"
          className="h-[42px] w-[120px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
        >
          <option value="all">전체 국가</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label htmlFor="lecture-status-filter" className="sr-only">
          상태 필터
        </label>
        <select
          id="lecture-status-filter"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          aria-label="상태 필터"
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
          + 강의 추가
        </Link>
      </div>
    </form>
  );
}
