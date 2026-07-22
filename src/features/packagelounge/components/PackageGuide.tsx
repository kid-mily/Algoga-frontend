import PackageInfoCard from "./PackageInfoCard";
import type { PackageDetailData } from "../packageDetail.types";

interface PackageGuideProps {
  data: PackageDetailData;
}

// 패키지 안내 탭: 기본 여행 정보
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
    </div>
  );
}
