import {
  PaymentStatus,
  PaymentType,
  paymentStatusOptions,
  paymentTypeOptions,
} from "../types";

type PaymentToolbarProps = {
  searchKeyword: string;
  fromDate: string;
  toDate: string;
  selectedStatus: PaymentStatus | "ALL";
  selectedType: PaymentType | "ALL";
  onSearchKeywordChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSelectedStatusChange: (value: PaymentStatus | "ALL") => void;
  onSelectedTypeChange: (value: PaymentType | "ALL") => void;
};

const isPaymentTypeFilter = (value: string): value is PaymentType | "ALL" => {
  return paymentTypeOptions.some((option) => option.value === value);
};

const isPaymentStatusFilter = (value: string): value is PaymentStatus | "ALL" => {
  return paymentStatusOptions.some((option) => option.value === value);
};

export default function PaymentToolbar({
  searchKeyword,
  fromDate,
  toDate,
  selectedStatus,
  selectedType,
  onSearchKeywordChange,
  onFromDateChange,
  onToDateChange,
  onSelectedStatusChange,
  onSelectedTypeChange,
}: PaymentToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="결제 내역 검색 및 필터"
        className="flex items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="payment-search" className="sr-only">
          결제 내역 검색
        </label>
        <input
          id="payment-search"
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="결제번호, 사용자명, 상품명, 결제수단 검색"
          className="h-[44px] min-w-0 flex-1 rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
        />

        <label htmlFor="payment-from-date" className="sr-only">
          조회 시작일
        </label>
        <input
          id="payment-from-date"
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(event) => onFromDateChange(event.target.value)}
          className="h-[44px] w-[142px] shrink-0 rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />

        <label htmlFor="payment-to-date" className="sr-only">
          조회 종료일
        </label>
        <input
          id="payment-to-date"
          type="date"
          value={toDate}
          min={fromDate}
          onChange={(event) => onToDateChange(event.target.value)}
          className="h-[44px] w-[142px] shrink-0 rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />

        <label htmlFor="payment-type-filter" className="sr-only">
          결제 유형 필터
        </label>
        <select
          id="payment-type-filter"
          value={selectedType}
          onChange={(event) => {
            if (isPaymentTypeFilter(event.target.value)) {
              onSelectedTypeChange(event.target.value);
            }
          }}
          className="h-[44px] w-[132px] shrink-0 rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        >
          {paymentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="payment-status-filter" className="sr-only">
          결제 상태 필터
        </label>
        <select
          id="payment-status-filter"
          value={selectedStatus}
          onChange={(event) => {
            if (isPaymentStatusFilter(event.target.value)) {
              onSelectedStatusChange(event.target.value);
            }
          }}
          className="h-[44px] w-[132px] shrink-0 rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        >
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
