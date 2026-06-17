type PaymentPaginationProps = {
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaymentPagination({
  currentPage,
  totalCount,
  totalPages,
  onPageChange,
}: PaymentPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-[16px] border border-[#E4E7EC] bg-white px-5 py-4">
      <span className="text-[14px] text-[#667085]">총 {totalCount}건</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        <span className="flex h-[34px] min-w-[54px] items-center justify-center rounded-[8px] bg-[#639E9B] px-3 text-[14px] font-bold text-white">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-[34px] rounded-[8px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </div>
  );
}
