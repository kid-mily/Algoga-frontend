"use client";

import { useMemo, useState } from "react";

interface PackageFormProps {
  mode: "create" | "edit";

  initialData?: {
    title: string;
    destination: string;
    nights: number;
    discountPercent: number;
    description: string;
    lecture: string;
    airline: string;
    airlinePrice: number;
    hotel: string;
    hotelPrice: number;
  };
}

export default function PackageForm({
  mode,
  initialData,
}: PackageFormProps) {

  const [title, setTitle] =
    useState(
      initialData?.title || ""
    );

  const [
    destination,
    setDestination,
  ] = useState(
    initialData?.destination || ""
  );

  const [nights, setNights] =
    useState(
      initialData?.nights || 4
    );

  const [
    discountPercent,
    setDiscountPercent,
  ] = useState(
    initialData?.discountPercent || 10
  );

  const [
    description,
    setDescription,
  ] = useState(
    initialData?.description || ""
  );

  const [lecture, setLecture] =
    useState(
      initialData?.lecture || ""
    );

  const [airline, setAirline] =
    useState(
      initialData?.airline || ""
    );

  const [
    airlinePrice,
    setAirlinePrice,
  ] = useState(
    initialData?.airlinePrice || 350000
  );

  const [hotel, setHotel] =
    useState(
      initialData?.hotel || ""
    );

  const [
    hotelPrice,
    setHotelPrice,
  ] = useState(
    initialData?.hotelPrice || 180000
  );

  // 총 금액
  const totalPrice =
    airlinePrice +
    hotelPrice * nights;

  // 할인 금액
  const discountPrice =
    Math.floor(
      totalPrice *
        (discountPercent / 100)
    );

  // 최종 가격
  const finalPrice =
    totalPrice -
    discountPrice;

  return (
    <div className="rounded-[24px] border border-[#E4E7EC] bg-white">
      <div className="p-7">
        {/* 상단 */}
        <div className="grid grid-cols-2 gap-5">
          {/* 패키지명 */}
          <div>
            <label className="text-[15px] font-semibold text-[#111827]">
              패키지명 *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="도쿄 프리미엄 5일 패키지"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
          </div>

          {/* 목적지 */}
          <div>
            <label className="text-[15px] font-semibold text-[#111827]">
              목적지 *
            </label>

            <input
              type="text"
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
              placeholder="일본 도쿄"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
          </div>
        </div>

        {/* 숙박 / 할인 */}
        <div className="mt-6 grid grid-cols-2 gap-5">
          {/* 숙박 */}
          <div>
            <label className="text-[15px] font-semibold text-[#111827]">
              숙박 기간 *
            </label>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="number"
                value={nights}
                onChange={(e) =>
                  setNights(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="h-[52px] w-[120px] rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
              />
              <span className="text-[15px] text-[#667085]">
                박 {nights + 1}일
              </span>
            </div>
          </div>

          {/* 할인 */}
          <div>
            <label className="text-[15px] font-semibold text-[#111827]">
              할인율 (%)
            </label>
            <div className="relative mt-3">
              <input
                type="number"
                value={discountPercent}
                onChange={(e) =>
                  setDiscountPercent(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 pr-10 text-[15px] outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#98A2B3]">
                %
              </span>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-6">
          <label className="text-[15px] font-semibold text-[#111827]">
            설명
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="패키지에 대한 간단한 설명을 입력하세요"
            className="mt-3 h-[110px] w-full resize-none rounded-[16px] border border-[#E4E7EC] px-4 py-4 text-[15px] outline-none"
          />
        </div>

        {/* 연결 강의 */}
        <div className="mt-6">
          <label className="text-[15px] font-semibold text-[#111827]">
            연결 강의
          </label>

          <input
            type="text"
            value={lecture}
            onChange={(e) =>
              setLecture(
                e.target.value
              )
            }
            className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
          />
        </div>

        {/* 항공권 */}
        <div className="mt-6">
          <label className="text-[15px] font-semibold text-[#111827]">
            항공권 선택 *
          </label>

          <input
            type="text"
            value={airline}
            onChange={(e) =>
              setAirline(
                e.target.value
              )
            }
            placeholder="대한항공 ICN → NRT"
            className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
          />
        </div>

        {/* 숙소 */}
        <div className="mt-6">
          <label className="text-[15px] font-semibold text-[#111827]">
            숙소 선택 *
          </label>
          <input
            type="text"
            value={hotel}
            onChange={(e) =>
              setHotel(
                e.target.value
              )
            }
            placeholder="도쿄 신주쿠 그랜드 호텔"
            className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
          />
        </div>

        {/* 가격 계산 */}
        <div className="mt-7 rounded-[18px] bg-[#F8FAFC] p-6">
          <h3 className="text-[17px] font-bold text-[#111827]">
            가격 계산
          </h3>

          <div className="mt-5 space-y-4">
            {/* 항공권 */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-[#667085]">
                항공권
              </span>
              <span className="font-semibold text-[#111827]">
                ₩{airlinePrice.toLocaleString()}
              </span>
            </div>

            {/* 숙소 */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-[#667085]">
                숙소 ({nights}박)
              </span>
              <span className="font-semibold text-[#111827]">
                ₩{(
                  hotelPrice * nights
                ).toLocaleString()}
              </span>
            </div>

            {/* 총금액 */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="font-semibold text-[#111827]">
                총 금액
              </span>
              <span className="font-bold text-[#111827]">
                ₩{totalPrice.toLocaleString()}
              </span>
            </div>

            {/* 할인 */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="font-semibold text-[#DC2626]">
                할인 ({discountPercent}%)
              </span>

              <span className="font-bold text-[#DC2626]">
                -₩{discountPrice.toLocaleString()}
              </span>
            </div>

            {/* 최종가격 */}
            <div className="flex items-center justify-between border-t border-[#E4E7EC] pt-4">
              <span className="text-[18px] font-bold text-[#439A97]">
                최종 가격
              </span>

              <span className="text-[30px] font-bold text-[#439A97]">

                ₩{finalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-end gap-3 border-t border-[#E4E7EC] px-7 py-5">

        <button
          type="button"
          className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#344054]"
        >
          취소
        </button>

        <button
          type="button"
          className="h-[48px] rounded-[14px] bg-[#439A97] px-7 text-[15px] font-semibold text-white transition hover:opacity-90"
        >
          {mode === "create"
            ? "등록하기"
            : "수정하기"}
        </button>
      </div>
    </div>
  );
}