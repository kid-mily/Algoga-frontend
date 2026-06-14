type CsRefundPaginationProps = {
  totalCount: number;
};

export default function CsRefundPagination({ totalCount }: CsRefundPaginationProps) {
  return (
    <nav
      className="mt-0 flex items-center justify-between border-t border-[#EEF0F3] bg-white px-6 py-4"
      aria-label="환불 요청 페이지 이동"
    >
      <span className="text-[14px] text-[#667085]">총 {totalCount}건</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        <button
          type="button"
          aria-current="page"
          className="h-[34px] w-[34px] rounded-[8px] bg-[#639E9B] text-white"
        >
          1
        </button>
        <button
          type="button"
          disabled
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
