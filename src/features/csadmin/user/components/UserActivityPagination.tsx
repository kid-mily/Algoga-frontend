type UserActivityPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export default function UserActivityPagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: UserActivityPaginationProps) {
  return (
    <nav className="flex items-center justify-between px-4 py-5" aria-label="유저 활동 페이지네이션">
      <span className="text-[14px] text-[#667085]">총 {totalCount.toLocaleString()}건</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        <span className="flex h-[34px] min-w-[34px] items-center justify-center rounded-[8px] bg-[#639E9B] px-3 text-[14px] font-semibold text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
