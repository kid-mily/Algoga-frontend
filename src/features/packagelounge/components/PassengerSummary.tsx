import Link from "next/link";
import PackageInfoCard from "./PackageInfoCard";
import type { PassengerFormData } from "../booking.types";

interface PassengerSummaryProps {
  passenger: PassengerFormData;
  packageId: string;
}

// 결제 페이지: 예약 페이지에서 입력한 탑승객 정보를 읽기 전용으로 보여주는 카드
export default function PassengerSummary({
  passenger,
  packageId,
}: PassengerSummaryProps) {
  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.06)] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
            PASSENGER
          </span>
          <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
            탑승객 정보
          </h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PackageInfoCard
          tone="muted"
          label="영문 이름"
          value={`${passenger.lastName} ${passenger.firstName}`}
        />
        <PackageInfoCard tone="muted" label="성별" value={passenger.gender} />
        <PackageInfoCard
          tone="muted"
          label="생년월일"
          value={passenger.birthDate}
        />
        <PackageInfoCard
          tone="muted"
          label="국적"
          value={passenger.nationality}
        />
        <PackageInfoCard
          tone="muted"
          label="여권 번호"
          value={passenger.passportNumber}
        />
        <PackageInfoCard
          tone="muted"
          label="여권 만료일"
          value={passenger.expiryDate}
        />
      </div>
    </section>
  );
}
