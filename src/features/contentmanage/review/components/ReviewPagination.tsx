type ReviewPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ReviewPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ReviewPaginationProps) {
  return (
    <nav
      aria-label="후기 페이지 이동"
      className="mt-0 flex items-center justify-between rounded-b-[16px] border-x border-b border-[#E4E7EC] bg-white px-6 py-4"
    >
      <span className="text-[14px] text-[#667085]">
        {currentPage}/{totalPages} 페이지
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] text-[#C0C7D2]"
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={`h-[36px] w-[36px] rounded-full text-[14px] font-semibold ${
                page === currentPage
                  ? "bg-[#639E9B] text-white"
                  : "border border-[#E4E7EC] text-[#667085]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] text-[#C0C7D2]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
