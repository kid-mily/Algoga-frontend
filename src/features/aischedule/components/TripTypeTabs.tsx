import { TRIP_TYPE_LABEL, type TripType } from "../types";

const TRIP_TYPES: TripType[] = ["BOOKING", "PACKAGE", "FREE"];

interface TripTypeTabsProps {
  value: TripType;
  onChange: (tripType: TripType) => void;
}

// 여행 유형 3-모드 탭: 구매한 여행 / 전체 패키지 / 자유 여행
export default function TripTypeTabs({ value, onChange }: TripTypeTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TRIP_TYPES.map((tripType) => {
        const active = tripType === value;

        return (
          <button
            key={tripType}
            type="button"
            onClick={() => onChange(tripType)}
            className={`rounded-2xl border py-3 text-sm font-bold transition ${
              active
                ? "border-[#439A97] bg-[#EEF8F7] text-[#439A97]"
                : "border-[#E1E8EF] text-[#718096] hover:bg-[#F3F8FC]"
            }`}
          >
            {TRIP_TYPE_LABEL[tripType]}
          </button>
        );
      })}
    </div>
  );
}
