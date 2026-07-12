import PackageInfoCard from "./PackageInfoCard";
import type { PackageDetailData } from "../packageDetail.types";

interface PackageGuideProps {
  data: PackageDetailData;
}

// 패키지 안내 탭: 기본 정보 카드 + 가격 구성
export default function PackageGuide({ data }: PackageGuideProps) {
  return (
    <div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <PackageInfoCard label="여행지" value={data.destination} />
          <PackageInfoCard label="여행 기간" value={data.duration} />
          <PackageInfoCard label="최대 인원" value={data.maxPeople} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PackageInfoCard label="출발일" value={data.startDate} />
          <PackageInfoCard label="귀국일" value={data.endDate} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#E1E8EF] bg-white p-5">
        <ul className="space-y-3">
          {data.priceRows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between text-sm text-[#0A1628]"
            >
              <span>{row.label}</span>
              <span className="font-bold">{row.price.toLocaleString()}원</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#EEF8F7] px-4 py-3">
          <span className="text-sm font-bold text-[#0A1628]">총 금액</span>
          <span className="text-lg font-extrabold text-[#439A97]">
            {data.priceRows
              .reduce((sum, row) => sum + row.price, 0)
              .toLocaleString()}
            원
          </span>
        </div>
      </div>
    </div>
  );
}
