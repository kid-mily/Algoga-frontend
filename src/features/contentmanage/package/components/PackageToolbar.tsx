type PackageToolbarProps = {
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
};

export default function PackageToolbar({
  searchKeyword,
  onSearchKeywordChange,
}: PackageToolbarProps) {
  return (
    <section className="mb-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="패키지 검색"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="package-search" className="sr-only">
          패키지 검색
        </label>
        <input
          id="package-search"
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="패키지명, 국가, 숙소, 공항 코드 검색"
          className="h-[44px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#439A97]"
        />
      </form>
    </section>
  );
}
