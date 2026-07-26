interface EvalutionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EvalutionPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EvalutionPaginationProps) {
  return (
    <nav aria-label="진단평가 결과 페이지" className="flex items-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        aria-label="이전 페이지"
        className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
      >
        이전
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`${page}페이지로 이동`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] text-[13px] font-semibold ${
              currentPage === page
                ? "bg-[#439A97] text-white"
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
        aria-label="다음 페이지"
        className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}
