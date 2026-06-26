interface Props {
  mileageBalance: number;
  maxMileage: number;
  mileageInputValue: string;
  usedMileage: number;
  onChange: (value: string) => void;
  onApply: () => void;
  onUseAll: () => void;
}

export default function MileageInput({
  mileageBalance,
  maxMileage,
  mileageInputValue,
  usedMileage,
  onChange,
  onApply,
  onUseAll,
}: Props) {
  return (
    <div className="mt-5 flex flex-col rounded-2xl border border-[#E8EEF5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/point-active.svg" alt="마일리지" />
          <h1 className="ml-2 font-bold">마일리지 사용</h1>
        </div>

        <p className="font-bold text-[#439A97]">
          보유: {mileageBalance.toLocaleString()}원
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <input
          type="number"
          placeholder="사용할 마일리지를 입력해 주세요"
          className="h-14 flex-1 rounded-2xl border border-[#E8EEF5] px-4 outline-none"
          min={0}
          max={maxMileage}
          value={mileageInputValue}
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          type="button"
          onClick={onUseAll}
          className="h-14 w-24 rounded-2xl border border-[#439A97] bg-white font-semibold text-[#439A97]"
        >
          전액
        </button>

        <button
          type="button"
          onClick={onApply}
          className="h-14 w-28 rounded-2xl bg-[#439A97] font-semibold text-white"
        >
          적용하기
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-[#8A9BB0]">
        <p>
          쿠폰 적용 후 남은 금액 내에서 최대 {maxMileage.toLocaleString()}원까지
          사용할 수 있습니다.
        </p>

        {usedMileage > 0 && (
          <p className="font-bold text-[#439A97]">
            적용됨: {usedMileage.toLocaleString()}원
          </p>
        )}
      </div>
    </div>
  );
}