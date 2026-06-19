type ReservationConversionToolbarProps = {
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
};

export default function ReservationConversionToolbar({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: ReservationConversionToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        aria-label="예약 전환율 기간 필터"
        className="flex items-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="conversion-from-date" className="text-[14px] font-semibold text-[#344054]">
          조회 기간
        </label>
        <input
          id="conversion-from-date"
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(event) => onFromDateChange(event.target.value)}
          className="h-[44px] w-[150px] rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />
        <span className="text-[14px] font-semibold text-[#98A2B3]">-</span>
        <label htmlFor="conversion-to-date" className="sr-only">
          조회 종료일
        </label>
        <input
          id="conversion-to-date"
          type="date"
          value={toDate}
          min={fromDate}
          onChange={(event) => onToDateChange(event.target.value)}
          className="h-[44px] w-[150px] rounded-[10px] border border-[#E4E7EC] px-3 text-[14px] font-semibold text-[#344054] outline-none focus:border-[#639E9B]"
        />
      </form>
    </section>
  );
}
