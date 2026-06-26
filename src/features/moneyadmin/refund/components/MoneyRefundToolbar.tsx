import { moneyRefundStatusOptions, MoneyRefundStatus } from "../types";

type MoneyRefundToolbarProps = {
  searchKeyword: string;
  selectedStatus: MoneyRefundStatus | "ALL";
  onSearchKeywordChange: (value: string) => void;
  onSelectedStatusChange: (value: MoneyRefundStatus | "ALL") => void;
};

export default function MoneyRefundToolbar({
  searchKeyword,
  selectedStatus,
  onSearchKeywordChange,
  onSelectedStatusChange,
}: MoneyRefundToolbarProps) {
  const handleStatusChange = (value: string) => {
    if (moneyRefundStatusOptions.includes(value as MoneyRefundStatus | "ALL")) {
      onSelectedStatusChange(value as MoneyRefundStatus | "ALL");
    }
  };

  return (
    <section
      className="mb-4 flex items-center gap-3 rounded-[16px] border border-[#E4E7EC] bg-white p-4"
      aria-label="환불 요청 검색 및 필터"
    >
      <label htmlFor="money-refund-search" className="sr-only">
        환불 요청 검색
      </label>
      <input
        id="money-refund-search"
        type="search"
        value={searchKeyword}
        onChange={(event) => onSearchKeywordChange(event.target.value)}
        placeholder="요청번호, 예약번호, 사용자, 상품명 검색"
        className="h-[42px] flex-1 rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3]"
      />

      <label htmlFor="money-refund-status" className="sr-only">
        환불 상태
      </label>
      <select
        id="money-refund-status"
        value={selectedStatus}
        onChange={(event) => handleStatusChange(event.target.value)}
        className="h-[42px] w-[160px] rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none"
      >
        {moneyRefundStatusOptions.map((status) => (
          <option key={status} value={status}>
            {status === "ALL" ? "전체 상태" : status}
          </option>
        ))}
      </select>
    </section>
  );
}
