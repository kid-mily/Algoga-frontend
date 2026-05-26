"use client";

import { useState } from "react";

type CouponFormMode =
  | "create"
  | "edit";

interface CouponFormProps {
  mode?: CouponFormMode;

  initialCoupon?: {
    name: string;

    discount: number;

    startDate: string;

    endDate: string;

    lecture: string;

    categories: string[];
  };
}

const categoryOptions = [
  "항공",
  "숙소",
  "액티비티",
];

export default function CouponForm({
  mode = "create",

  initialCoupon = {
    name: "",

    discount: 0,

    startDate: "",

    endDate: "",

    lecture: "",

    categories: [],
  },
}: CouponFormProps) {

  const [name, setName] =
    useState(
      initialCoupon.name
    );

  const [discount, setDiscount] =
    useState(
      initialCoupon.discount
    );

  const [startDate, setStartDate] =
    useState(
      initialCoupon.startDate
    );

  const [endDate, setEndDate] =
    useState(
      initialCoupon.endDate
    );

  const [lecture, setLecture] =
    useState(
      initialCoupon.lecture
    );

  const [categories, setCategories] =
    useState<string[]>(
      initialCoupon.categories
    );

  // 카테고리 선택
  const handleCategoryClick = (
    category: string
  ) => {

    if (
      categories.includes(category)
    ) {

      setCategories(
        categories.filter(
          (item) =>
            item !== category
        )
      );

      return;
    }

    setCategories([
      ...categories,
      category,
    ]);
  };

  return (
    <div className="mt-6 rounded-[24px] border border-[#E4E7EC] bg-white p-6">

      {/* 쿠폰명 */}
      <div>

        <label className="text-[15px] font-semibold text-[#111827]">
          쿠폰명
          <span className="text-[#D92D20]">
            {" "}*
          </span>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="예: 일본 여행 완료 할인 쿠폰"
          className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
        />
      </div>

      {/* 할인율 */}
      <div className="mt-7">

        <label className="text-[15px] font-semibold text-[#111827]">
          할인율 (%)
          <span className="text-[#D92D20]">
            {" "}*
          </span>
        </label>

        <div className="relative mt-3">

          <input
            type="number"
            value={discount}
            onChange={(e) =>
              setDiscount(
                Number(
                  e.target.value
                )
              )
            }
            className="h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 pr-10 text-[15px] outline-none"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-[#98A2B3]">
            %
          </span>
        </div>
      </div>

      {/* 날짜 */}
      <div className="mt-7 grid grid-cols-2 gap-4">

        {/* 시작일 */}
        <div>

          <label className="text-[15px] font-semibold text-[#111827]">
            시작일
            <span className="text-[#D92D20]">
              {" "}*
            </span>
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
          />
        </div>

        {/* 종료일 */}
        <div>

          <label className="text-[15px] font-semibold text-[#111827]">
            종료일
            <span className="text-[#D92D20]">
              {" "}*
            </span>
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
          />
        </div>
      </div>

      {/* 강의 */}
      <div className="mt-7">

        <label className="text-[15px] font-semibold text-[#111827]">
          쿠폰 발급 강의
          <span className="text-[#D92D20]">
            {" "}*
          </span>
        </label>

        <select
          value={lecture}
          onChange={(e) =>
            setLecture(
              e.target.value
            )
          }
          className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
        >

          <option value="">
            강의를 선택해주세요
          </option>

          <option>
            일본 여행 완벽 가이드
          </option>

          <option>
            파리 완전 정복 2024
          </option>

          <option>
            뉴욕 자유여행 가이드
          </option>
        </select>

        <p className="mt-2 text-[13px] text-[#98A2B3]">
          선택한 강의를 수료한 학생에게 쿠폰이 자동 발급됩니다
        </p>
      </div>

      {/* 카테고리 */}
      <div className="mt-7">

        <div className="flex items-center gap-2">

          <p className="text-[15px] font-semibold text-[#111827]">
            할인 적용 카테고리
          </p>

          <span className="text-[#D92D20]">
            *
          </span>
        </div>

        <div className="mt-4 flex gap-3">

          {categoryOptions.map(
            (category) => {

              const isSelected =
                categories.includes(
                  category
                );

              return (
                <button
                  key={category}

                  type="button"

                  onClick={() =>
                    handleCategoryClick(
                      category
                    )
                  }

                  className={`h-[44px] rounded-[14px] border px-6 text-[14px] font-semibold transition ${
                    isSelected
                      ? "border-[#439A97] bg-[#439A97] text-white"
                      : "border-[#E4E7EC] bg-white text-[#344054]"
                  }`}
                >
                  {category}
                </button>
              );
            }
          )}
        </div>

        <p className="mt-3 text-[13px] text-[#98A2B3]">
          복수 선택 가능
        </p>
      </div>

      {/* 버튼 */}
      <div className="mt-8 flex items-center justify-end border-t border-[#E4E7EC] pt-6">

        <div className="flex items-center gap-3">

          {/* 취소 */}
          <button
            type="button"
            className="h-[44px] rounded-[14px] border border-[#E4E7EC] px-5 text-[14px] font-semibold text-[#667085]"
          >
            취소
          </button>

          {/* 등록 */}
          <button
            type="button"
            className="h-[44px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
          >
            {mode === "create"
              ? "등록하기"
              : "수정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}