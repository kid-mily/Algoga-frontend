type BlacklistPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function BlacklistPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlacklistPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2 border-t border-[#EEF0F3] px-4 py-4"
      aria-label="블랙리스트 페이지네이션"
    >
      <button
        type="button"
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-3 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
      >
        다음
      </button>
    </nav>
  );
}
