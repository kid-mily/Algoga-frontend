import { CsRefundStatus, refundStatusOptions } from "../types";

type CsRefundToolbarProps = {
  searchKeyword: string;
  selectedStatus: CsRefundStatus | "ALL";
  onSearchKeywordChange: (value: string) => void;
  onSelectedStatusChange: (value: CsRefundStatus | "ALL") => void;
};

export default function CsRefundToolbar({
  searchKeyword,
  selectedStatus,
  onSearchKeywordChange,
  onSelectedStatusChange,
}: CsRefundToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="환불 요청 검색 및 필터"
        className="flex flex-wrap items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex h-[44px] min-w-[280px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <span className="text-[18px] text-[#98A2B3]" aria-hidden="true">
            ⌕
          </span>
          <label htmlFor="refund-search" className="sr-only">
            사용자, 예약번호, 상품명 검색
          </label>
          <input
            id="refund-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="사용자, 예약번호, 상품명 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <label htmlFor="refund-status-filter" className="sr-only">
          환불 상태 필터
        </label>
        <select
          id="refund-status-filter"
          value={selectedStatus}
          onChange={(event) =>
            onSelectedStatusChange(event.target.value as CsRefundStatus | "ALL")
          }
          className="h-[44px] w-[150px] rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[14px] font-semibold text-[#344054] outline-none"
        >
          {refundStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "전체 상태" : status}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
