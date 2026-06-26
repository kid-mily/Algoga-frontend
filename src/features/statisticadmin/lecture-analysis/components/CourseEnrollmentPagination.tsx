import { formatNumber } from "../utils";

type CourseEnrollmentPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

export default function CourseEnrollmentPagination({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: CourseEnrollmentPaginationProps) {
  return (
    <nav
      className="flex items-center justify-between border-t border-[#EEF0F3] px-6 py-4"
      aria-label="수강률 분석 페이지네이션"
    >
      <p className="text-[13px] font-medium text-[#667085]">
        총 {formatNumber(totalElements)}개 강의 · {currentPage}/{totalPages} 페이지
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지로 이동"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-[32px] rounded-[7px] border border-[#E4E7EC] px-3 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          이전
        </button>
        <span
          aria-current="page"
          className="flex h-[32px] min-w-[32px] items-center justify-center rounded-[7px] bg-[#639E9B] px-3 text-[13px] font-bold text-white"
        >
          {currentPage}
        </span>
        <button
          type="button"
          aria-label="다음 페이지로 이동"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-[32px] rounded-[7px] border border-[#E4E7EC] px-3 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
