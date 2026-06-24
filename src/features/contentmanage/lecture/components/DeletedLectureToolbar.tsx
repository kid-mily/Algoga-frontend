import Image from "next/image";
import type { CourseCountry } from "../types";

type DeletedLectureToolbarProps = {
  countries: CourseCountry[];
  selectedCountryId: string;
  countryNameKeyword: string;
  onSelectedCountryIdChange: (value: string) => void;
  onCountryNameKeywordChange: (value: string) => void;
};

export default function DeletedLectureToolbar({
  countries,
  selectedCountryId,
  countryNameKeyword,
  onSelectedCountryIdChange,
  onCountryNameKeywordChange,
}: DeletedLectureToolbarProps) {
  return (
    <form
      role="search"
      aria-label="삭제 강의 검색 및 필터"
      className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-wrap gap-3">
        <label htmlFor="deleted-lecture-country" className="sr-only">
          국가 ID 필터
        </label>
        <select
          id="deleted-lecture-country"
          value={selectedCountryId}
          onChange={(event) => onSelectedCountryIdChange(event.target.value)}
          className="h-[42px] w-[160px] rounded-[12px] border border-[#E4E7EC] px-3 text-[13px] outline-none"
        >
          <option value="">전체 국가</option>
          {countries.map((country) => (
            <option key={country.countryId} value={country.countryId}>
              {country.countryName}
            </option>
          ))}
        </select>

        <div className="flex h-[42px] min-w-[240px] flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
          <Image
            src="/images/search.svg"
            alt=""
            width={15}
            height={15}
            aria-hidden="true"
          />
          <label htmlFor="deleted-lecture-country-name" className="sr-only">
            국가명 검색
          </label>
          <input
            id="deleted-lecture-country-name"
            type="search"
            value={countryNameKeyword}
            onChange={(event) => onCountryNameKeywordChange(event.target.value)}
            placeholder="국가명 검색"
            className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>
      </div>
    </form>
  );
}