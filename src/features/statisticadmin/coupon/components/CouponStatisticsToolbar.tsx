import Image from "next/image";

type CouponStatisticsToolbarProps = {
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
};

export default function CouponStatisticsToolbar({
  searchKeyword,
  onSearchKeywordChange,
}: CouponStatisticsToolbarProps) {
  return (
    <section
      className="mb-4 rounded-[16px] border border-[#E4E7EC] bg-white p-4"
      aria-label="쿠폰 통계 검색"
    >
      <label className="flex h-[42px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
        <span className="sr-only">쿠폰 통계 검색</span>
        <Image src="/images/search.svg" alt="" aria-hidden width={17} height={17} />
        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="쿠폰명, 강의명, 쿠폰 ID 검색"
          className="w-full rounded-[6px] text-[14px] outline-none placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#639E9B]"
        />
      </label>
    </section>
  );
}
