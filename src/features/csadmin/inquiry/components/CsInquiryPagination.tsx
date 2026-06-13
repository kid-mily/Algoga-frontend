type CsInquiryPaginationProps = {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CsInquiryPagination({
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: CsInquiryPaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="고객 문의 페이지 이동"
      className="flex items-center justify-between rounded-b-[16px] border-x border-b border-[#E4E7EC] bg-white px-6 py-4"
    >
      <span className="text-[14px] text-[#667085]">총 {totalCount}건</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] text-[#344054] disabled:cursor-not-allowed disabled:text-[#C0C7D2]"
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={`h-[34px] w-[34px] rounded-[8px] text-[14px] ${
                isCurrent
                  ? "bg-[#639E9B] text-white"
                  : "border border-[#E4E7EC] text-[#344054]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] text-[#344054] disabled:cursor-not-allowed disabled:text-[#C0C7D2]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
