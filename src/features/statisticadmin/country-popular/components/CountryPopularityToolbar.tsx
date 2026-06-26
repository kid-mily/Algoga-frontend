import Image from "next/image";

type CountryPopularityToolbarProps = {
  fromDate: string;
  toDate: string;
  searchKeyword: string;
  isDownloading: boolean;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSearchKeywordChange: (value: string) => void;
  onCsvDownload: () => void;
};

export default function CountryPopularityToolbar({
  fromDate,
  toDate,
  searchKeyword,
  isDownloading,
  onFromDateChange,
  onToDateChange,
  onSearchKeywordChange,
  onCsvDownload,
}: CountryPopularityToolbarProps) {
  return (
    <section
      className="mb-4 flex items-center justify-between gap-4 rounded-[16px] border border-[#E4E7EC] bg-white p-4"
      aria-label="나라별 인기도 검색 및 다운로드"
    >
      <div className="flex items-center gap-3">
        <label
          htmlFor="country-popular-from-date"
          className="text-[14px] font-semibold text-[#344054]"
        >
          조회 기간
        </label>
        <input
          id="country-popular-from-date"
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(event) => onFromDateChange(event.target.value)}
          className="h-[42px] w-[150px] rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />
        <span className="text-[14px] font-semibold text-[#98A2B3]">-</span>
        <label htmlFor="country-popular-to-date" className="sr-only">
          조회 종료일
        </label>
        <input
          id="country-popular-to-date"
          type="date"
          value={toDate}
          min={fromDate}
          onChange={(event) => onToDateChange(event.target.value)}
          className="h-[42px] w-[150px] rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />

        <label className="flex h-[42px] w-[360px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <span className="sr-only">나라별 인기도 검색</span>
          <Image src="/images/search.svg" alt="" aria-hidden width={17} height={17} />
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="국가명 또는 국가 ID 검색"
            className="w-full rounded-[6px] text-[14px] outline-none placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#639E9B]"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onCsvDownload}
        disabled={isDownloading}
        className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#439A97] px-4 text-[14px] font-semibold text-white transition hover:bg-[#367C79] disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
      >
        <Image src="/images/download.svg" alt="" aria-hidden width={16} height={16} />
        {isDownloading ? "다운로드 중..." : "CSV 다운로드"}
      </button>
    </section>
  );
}
