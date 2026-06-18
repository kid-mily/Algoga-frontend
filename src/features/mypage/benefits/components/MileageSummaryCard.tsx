import Image from "next/image";
import { MyMileage } from "./types";

interface MileageSummaryCardProps {
  mileage: MyMileage;
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString("ko-KR");
}

export function MileageSummaryCard({ mileage }: MileageSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">보유 마일리지</p>

          <p className="mt-4 text-3xl font-bold text-gray-900">
            {formatNumber(mileage.totalMileage)}
          </p>
        </div>

        <div className="">
          <Image
            src = "/images/point-active.svg"
            alt="마일리지 이미지"
            width={36}
            height={36}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">총 적립</span>

          <span className="font-semibold text-green-600">
            +{formatNumber(mileage.totalEarnedMileage)}
          </span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-gray-500">총 사용</span>

          <span className="font-semibold text-red-500">
            -{formatNumber(mileage.totalUsedMileage)}
          </span>
        </div>
      </div>
    </article>
  );
}