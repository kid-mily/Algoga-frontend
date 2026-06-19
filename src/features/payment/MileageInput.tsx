interface Props {
    mileageBalance: number;
    maxMileage: number;
    usedMileage: number;
    onChange: (value: string) => void;
}

export default function MileageInput({ mileageBalance, maxMileage, usedMileage, onChange }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/point-active.svg" alt="마일리지" />
                    <h1 className="ml-2 font-bold">마일리지 사용</h1>
                </div>
                <p className="text-[#439A97] font-bold">
                    보유: {mileageBalance.toLocaleString()}원
                </p>
            </div>

            <div className="mt-5 flex gap-3">
                <input 
                    type="number"
                    placeholder="사용할 마일리지를 입력해주세요"
                    className="flex-1 h-14 border border-[#E8EEF5] rounded-2xl px-4 outline-none"
                    min={0}
                    max={maxMileage}
                    value={usedMileage}
                    onChange={(e) => onChange(e.target.value)}
                    // className="mt-3 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 outline-none"
                />

                <button className="w-28 h-14 bg-[#439A97] text-white font-semibold rounded-2xl">사용하기</button>
            </div>
            <p className="text-sm text-[#8A9BB0] mt-3 ml-3">
                쿠폰 적용 후 남은 금액 내에서 최대 15,000원까지 사용 가능합니다
            </p>
            <div className="mt-4 bg-[#EEF7FF] border border-[#7DB8FF] rounded-2xl px-4 py-3 text-sm text-[#1D6FD8]">
                ✓ 환불 시 사용한 마일리지는 전액 반환됩니다
            </div>
        </div>
    );
}