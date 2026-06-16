type CsRefundPaginationProps = {
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CsRefundPagination({
  currentPage,
  totalCount,
  totalPages,
  onPageChange,
}: CsRefundPaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      className="mt-0 flex items-center justify-between border-t border-[#EEF0F3] bg-white px-6 py-4"
      aria-label="환불 요청 페이지 이동"
    >
      <span className="text-[14px] text-[#667085]">총 {totalCount}건</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        <span
          aria-current="page"
          className="inline-flex h-[34px] min-w-[42px] items-center justify-center rounded-[8px] bg-[#639E9B] px-3 text-[14px] text-white"
        >
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
