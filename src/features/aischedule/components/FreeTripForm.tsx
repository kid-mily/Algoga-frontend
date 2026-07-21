interface FreeTripFormProps {
  destination: string;
  startDate: string;
  endDate: string;
  onDestinationChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

// tripType=FREE 입력: 목적지 + 여행 기간을 직접 입력한다
export default function FreeTripForm({
  destination,
  startDate,
  endDate,
  onDestinationChange,
  onStartDateChange,
  onEndDateChange,
}: FreeTripFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-bold text-[#0A1628]">목적지</label>
        <input
          type="text"
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
          placeholder="예: 일본 오사카"
          className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] px-3 text-sm outline-none focus:border-[#439A97]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-[#0A1628]">출발일</label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] px-3 text-sm outline-none focus:border-[#439A97]"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#0A1628]">도착일</label>
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] px-3 text-sm outline-none focus:border-[#439A97]"
          />
        </div>
      </div>
    </div>
  );
}
