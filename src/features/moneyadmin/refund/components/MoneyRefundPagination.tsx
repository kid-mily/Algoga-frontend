import { useMemo } from "react";

type MoneyRefundPaginationProps = {
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function MoneyRefundPagination({
  currentPage,
  totalCount,
  totalPages,
  onPageChange,
}: MoneyRefundPaginationProps) {
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  return (
    <nav
      role="navigation"
      aria-label="환불 요청 페이지네이션"
      className="mt-4 flex items-center justify-between"
    >
      <p className="text-[13px] text-[#667085]">총 {totalCount}건</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지로 이동"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-3 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`h-[34px] min-w-[34px] rounded-[8px] px-3 text-[13px] font-bold ${
              page === currentPage
                ? "bg-[#439A97] text-white"
                : "border border-[#E4E7EC] text-[#344054]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지로 이동"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-3 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
