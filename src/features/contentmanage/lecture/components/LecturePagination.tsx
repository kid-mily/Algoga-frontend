type LecturePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function LecturePagination({
  currentPage,
  totalPages,
  onPageChange,
}: LecturePaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
        className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음
      </button>
    </div>
  );
}