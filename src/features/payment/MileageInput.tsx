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
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
            MILEAGE
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
            마일리지 사용
          </h2>
        </div>

        <span className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-bold text-[#357F7C]">
          보유 {mileageBalance.toLocaleString()}원
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_88px_104px]">
        <input
          type="number"
          placeholder="사용할 마일리지를 입력해 주세요"
          className="h-14 rounded-2xl border border-[#E1E8EF] bg-[#FAFCFE] px-4 text-sm font-medium outline-none transition focus:border-[#439A97] focus:bg-white"
          min={0}
          max={maxMileage}
          value={mileageInputValue}
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          type="button"
          onClick={onUseAll}
          className="h-14 rounded-2xl border border-[#B7DAD7] bg-white text-sm font-bold text-[#357F7C] transition hover:bg-[#F6FBFA]"
        >
          전액
        </button>

        <button
          type="button"
          onClick={onApply}
          className="h-14 rounded-2xl bg-[#439A97] text-sm font-bold text-white transition hover:bg-[#357F7C]"
        >
          적용
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[#8A94A6]">
        <p>최대 {maxMileage.toLocaleString()}원까지 사용할 수 있습니다.</p>

        {usedMileage > 0 ? (
          <p className="font-bold text-[#357F7C]">
            적용 {usedMileage.toLocaleString()}원
          </p>
        ) : null}
      </div>
    </section>
  );
}