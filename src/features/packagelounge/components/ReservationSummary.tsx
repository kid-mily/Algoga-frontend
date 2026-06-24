import Image from "next/image";
import Link from "next/link";

import type { CourseItem } from "@/features/classroom/components/types";
import type { AccommodationResponse, PackageApiItem } from "../types";
import { calculatePayment, formatDateTime } from "../utils/payment";

interface ReservationSummaryProps {
  packageItem: PackageApiItem;
  accommodation: AccommodationResponse;
  course: CourseItem;
  continentCode: string;
}

export default function ReservationSummary({
  packageItem,
  accommodation,
  course,
  continentCode,
}: ReservationSummaryProps) {
  const payment = calculatePayment({
    lecturePrice: course.price,
    packageItem,
    accommodation,
  });
  const flight = packageItem.flightInfo;
  const backHref =
    `/packagelounge?countryId=${packageItem.countryId}` +
    `&courseId=${course.courseId}` +
    `&continentCode=${encodeURIComponent(continentCode)}`;

  return (
    <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
      <div className="mx-auto max-w-[760px]">
        <Link href={backHref} className="text-xs font-medium text-[#5B8BC9]">
          ← 뒤로가기
        </Link>
        <h1 className="mt-6 text-xl font-bold text-[#111B2D]">예약 확인</h1>
        <p className="mt-2 text-xs text-[#91A0B5]">
          예약 내용을 최종 확인해주세요.
        </p>

        <div className="mt-7 space-y-4">
          <InformationCard title="강의 정보">
            <DetailRow label="강의명" value={course.title} />
            <DetailRow
              label="강의 금액 (전액)"
              value={`${payment.lectureAmount.toLocaleString()}원`}
            />
          </InformationCard>

          <InformationCard title="항공권 정보">
            {flight ? (
              <>
                <DetailRow
                  label="항공사"
                  value={`${flight.airline} ${flight.flightNumber}`}
                />
                <DetailRow
                  label="출발"
                  value={`${flight.departure} · ${formatDateTime(flight.departureTime)}`}
                />
                <DetailRow
                  label="도착"
                  value={`${flight.arrival} · ${formatDateTime(flight.arrivalTime)}`}
                />
                <DetailRow label="비행시간" value={flight.duration} />
                <DetailRow
                  label="항공권 금액"
                  value={`${payment.flightAmount.toLocaleString()}원`}
                />
              </>
            ) : (
              <p className="text-xs text-[#98701B]">
                현재 항공편 정보를 불러올 수 없습니다.
              </p>
            )}
          </InformationCard>

          <InformationCard title="숙소 정보">
            {accommodation.imageUrl && (
              <div className="relative mb-4 h-44 overflow-hidden rounded-xl">
                <Image
                  src={accommodation.imageUrl}
                  alt={accommodation.name}
                  fill
                  sizes="760px"
                  className="object-cover"
                />
              </div>
            )}
            <DetailRow label="숙소명" value={accommodation.name} />
            <DetailRow label="주소" value={accommodation.address} />
            <DetailRow label="체크인" value={packageItem.checkInDate} />
            <DetailRow label="체크아웃" value={packageItem.checkOutDate} />
            <DetailRow label="숙박" value={`${accommodation.nights}박`} />
            <DetailRow
              label="1박 가격"
              value={`${accommodation.pricePerNight.toLocaleString()}원`}
            />
            <DetailRow
              label="숙소 총액"
              value={`${payment.accommodationAmount.toLocaleString()}원`}
            />
          </InformationCard>

          <InformationCard title="결제 금액">
            <DetailRow
              label="강의 (전액)"
              value={`${payment.lectureAmount.toLocaleString()}원`}
            />
            <DetailRow
              label="여행 총액 (항공 + 숙소)"
              value={`${payment.travelAmount.toLocaleString()}원`}
            />
            <DetailRow
              label="예약금 (여행 금액의 30%)"
              value={`${payment.depositAmount.toLocaleString()}원`}
            />
            <DetailRow
              label="잔금 (출발 14일 전)"
              value={`${payment.balanceAmount.toLocaleString()}원`}
            />
            <div className="border-t border-[#EDF0F4]" />
            <div className="flex items-center justify-between gap-4">
              <strong className="text-sm text-[#172235]">지금 결제할 금액</strong>
              <strong className="text-xl text-[#D45B2F]">
                {payment.initialPaymentAmount.toLocaleString()}원
              </strong>
            </div>
            <p className="rounded-xl border border-[#E8B63A] bg-[#FFF9E8] p-3 text-[11px] leading-5 text-[#8A6A18]">
              강의는 전액 결제되며 항공권과 숙소는 여행 총액의 30%만
              예약금으로 결제됩니다. 잔금에는 강의 금액이 포함되지 않습니다.
            </p>
          </InformationCard>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={backHref}
            className="rounded-xl border border-[#DFE5ED] py-3 text-center text-xs font-semibold text-[#667085]"
          >
            취소
          </Link>
          <button
            type="button"
            title="예약 생성 API 명세 확인 후 연결합니다."
            className="rounded-xl bg-[#67A19E] py-3 text-xs font-bold text-white"
          >
            예약 정보 입력하기
          </button>
        </div>
      </div>
    </main>
  );
}

function InformationCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E6EBF1] bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold text-[#142033]">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-8 text-xs">
      <span className="text-[#91A0B5]">{label}</span>
      <strong className="text-right text-[#172235]">{value}</strong>
    </div>
  );
}
