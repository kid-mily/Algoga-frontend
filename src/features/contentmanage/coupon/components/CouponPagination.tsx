import { CouponPaginationProps } from "../types";

export default function CouponPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CouponPaginationProps) {
  return (
    <nav aria-label="쿠폰 목록 페이지" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
      >
        이전
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[14px] font-semibold ${
              currentPage === page
                ? "bg-[#439A97] text-white"
                : "border border-[#E4E7EC] bg-white text-[#667085]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}