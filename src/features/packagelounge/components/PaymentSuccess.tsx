import Image from "next/image";
import Link from "next/link";
import type { PaymentSuccessData } from "../paymentSuccess.types";

interface PaymentSuccessProps {
  data: PaymentSuccessData;
}

// 패키지 결제 완료 카드: 결제 방식(일시불/분할 결제)에 따라 안내 문구와 금액을 다르게 보여준다
export default function PaymentSuccess({ data }: PaymentSuccessProps) {
  const isDeposit = data.paymentMode === "분할 결제";

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.08)] sm:p-8">
      {/* 상단 성공 아이콘 + 안내 문구 */}
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF8F7]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12.5L9.5 17L19 7"
              stroke="#439A97"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h1 className="mt-4 text-xl font-extrabold text-[#0A1628] sm:text-2xl">
          {isDeposit
            ? "예약금 결제가 완료되었습니다!"
            : "결제가 완료되었습니다!"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#718096]">
          {isDeposit ? (
            <>
              패키지 예약이 정상적으로 접수되었습니다.
              <br />
              남은 잔금은 안내된 기한까지 결제해 주세요.
            </>
          ) : (
            "패키지 예약이 정상적으로 완료되었습니다."
          )}
        </p>
      </div>

      {/* 선택한 패키지 정보 */}
      <div className="mt-6 rounded-xl border border-[#E1E8EF] p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={data.heroImage}
              alt={data.packageName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#0A1628]">
              {data.packageName}
            </p>
            <p className="mt-0.5 text-xs text-[#718096]">
              {data.destination}
            </p>
            <p className="mt-0.5 text-xs text-[#718096]">
              {data.startDate} ~ {data.endDate} · {data.duration}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-dashed border-[#D6E0E8] pt-3 text-xs text-[#718096]">
          <div>
            <p className="text-[#A0AEC0]">항공권</p>
            <p className="mt-0.5 font-bold text-[#0A1628]">
              {data.airline} {data.flightNumber}
            </p>
          </div>
          <div>
            <p className="text-[#A0AEC0]">숙소</p>
            <p className="mt-0.5 font-bold text-[#0A1628]">
              {data.accommodationName}
            </p>
          </div>
          {data.courseName && (
            <div className="col-span-2">
              <p className="text-[#A0AEC0]">강의</p>
              <p className="mt-0.5 font-bold text-[#0A1628]">
                {data.courseName}
                {data.coursePrice !== null && (
                  <span className="ml-1 font-extrabold text-[#439A97]">
                    ({data.coursePrice.toLocaleString()}원)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="mt-4 space-y-2 rounded-xl bg-[#F3F8FC] p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#718096]">예약 번호</span>
          <strong className="font-bold text-[#439A97]">
            {data.reservationNumber}
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#718096]">예약일</span>
          <strong className="font-bold text-[#0A1628]">
            {data.reservationDate}
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#718096]">결제 방식</span>
          <strong className="font-bold text-[#0A1628]">
            {data.paymentMode}
          </strong>
        </div>
      </div>

      {/* 결제 금액 (일시불 / 분할 결제 조건부 표시) */}
      {isDeposit ? (
        <div className="mt-4 space-y-2 rounded-xl bg-[#EEF8F7] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">총 상품 금액</span>
            <strong className="font-bold text-[#0A1628]">
              {data.totalAmount.toLocaleString()}원
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">이번 결제 금액</span>
            <strong className="font-bold text-[#439A97]">
              {data.paidAmount.toLocaleString()}원
            </strong>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-2">
            <span className="font-bold text-[#0A1628]">남은 결제 금액</span>
            <strong className="text-base font-extrabold text-[#439A97]">
              {data.remainingAmount.toLocaleString()}원
            </strong>
          </div>
          {data.balanceDueDate && (
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0A1628]">잔금 결제 기한</span>
              <strong className="font-bold text-[#439A97]">
                {data.balanceDueDate}
              </strong>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-2 rounded-xl bg-[#EEF8F7] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">총 결제 금액</span>
            <strong className="text-base font-extrabold text-[#439A97]">
              {data.paidAmount.toLocaleString()}원
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0A1628]">남은 결제 금액</span>
            <strong className="font-bold text-[#0A1628]">
              {data.remainingAmount.toLocaleString()}원
            </strong>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="mt-4 rounded-xl bg-[#EEF8F7] p-4 text-xs leading-5 text-[#0A1628]">
        {isDeposit ? (
          <>
            <p>
              예약금 결제가 완료되었습니다. 남은 잔금{" "}
              {data.remainingAmount.toLocaleString()}원은{" "}
              {data.balanceDueDate}까지 결제해 주세요.
            </p>
            <p className="mt-1 text-[#0A1628]/70">
              기한 내 결제가 완료되지 않으면 예약이 취소될 수 있습니다.
            </p>
            <Link
              href="/mypage/reservations"
              className="mt-2 inline-block font-bold text-[#439A97] hover:underline"
            >
              잔금 결제 일정 확인하기
            </Link>
          </>
        ) : (
          <>
            <p>
              예약 확인 및 상세 일정은 등록하신 이메일로 전송되었습니다.
            </p>
            <p className="mt-1 text-[#0A1628]/70">
              마이페이지에서도 예약 내역을 확인할 수 있습니다.
            </p>
          </>
        )}
      </div>

      {/* 이동 버튼 */}
      <Link
        href="/aischedule"
        className="mt-6 block w-full rounded-xl bg-[#439A97] py-3 text-center text-sm font-bold text-white transition hover:bg-[#357F7C]"
      >
        AI 일정 추천받기
      </Link>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/mypage/reservations"
          className="rounded-xl border border-[#E1E8EF] bg-white py-3 text-center text-sm font-bold text-[#0A1628] transition hover:bg-[#F3F8FC]"
        >
          예약 내역
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-[#E1E8EF] bg-white py-3 text-center text-sm font-bold text-[#0A1628] transition hover:bg-[#F3F8FC]"
        >
          메인으로
        </Link>
      </div>
    </div>
  );
}
