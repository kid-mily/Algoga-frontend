import Image from "next/image";
import { ChangeEvent, FormEvent } from "react";

type CourseEnrollmentToolbarProps = {
  searchKeyword: string;
  onSearchKeywordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CourseEnrollmentToolbar({
  searchKeyword,
  onSearchKeywordChange,
  onSearchSubmit,
}: CourseEnrollmentToolbarProps) {
  return (
    <section className="mb-5 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="강의 수강률 검색"
        className="flex items-center gap-3"
        onSubmit={onSearchSubmit}
      >
        <label className="flex h-[42px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <span className="sr-only">강의명 검색</span>
          <Image
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            width={17}
            height={17}
          />

          <input
            type="search"
            value={searchKeyword}
            onChange={onSearchKeywordChange}
            placeholder="강의명 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3] focus:ring-0"
          />
        </label>
      </form>
    </section>
  );
}
