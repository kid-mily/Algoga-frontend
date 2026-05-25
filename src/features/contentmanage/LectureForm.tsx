"use client";
import { useState } from "react";

interface LectureFormProps {
  onNext?: () => void;
}

interface Coupon {
  id: number;
  title: string;
  expire: string;
  discount: number;
}

export default function LectureForm({
  onNext,
}: LectureFormProps) {

  // 기본 정보 state
  const [formData, setFormData] =
    useState({
      country: "",
      title: "",
      description: "",
      price: "",
      mileage: "",
    });

  // 썸네일 이미지
  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  // 첨부 파일
  const [attachments, setAttachments] =
    useState<File[]>([]);

  // 썸네일 미리보기
  const [preview, setPreview] =
    useState<string>(
      "/images/thumb.png"
  );

  // 쿠폰 검색
  const [couponSearch, setCouponSearch] =
    useState("");

  // 쿠폰 리스트
  const [coupons] = useState<Coupon[]>([
    {
      id: 1,
      title: "일본 여행 완료 할인 쿠폰",
      expire: "2024.12.31",
      discount: 20,
    },
    {
      id: 2,
      title: "파리 여행 수료 특별 할인",
      expire: "2024.06.30",
      discount: 15,
    },
    {
      id: 3,
      title: "여름 시즌 특가",
      expire: "2024.08.31",
      discount: 25,
    },
  ]);

  // 쿠폰 필터
  const filteredCoupons =
    coupons.filter((coupon) =>
      coupon.title
        .toLowerCase()
        .includes(
          couponSearch.toLowerCase()
        )
    );

  // 쿠폰 선택
  const [selectedCoupons, setSelectedCoupons] =
    useState<number[]>([]);

  // input 변경
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 쿠폰 선택
  const handleCouponToggle = (
    couponId: number
  ) => {

    setSelectedCoupons((prev) => {

      if (prev.includes(couponId)) {

        return prev.filter(
          (id) => id !== couponId
        );
      }

      return [...prev, couponId];
    });
  };

  // 썸네일 업로드
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // 첨부파일 업로드
  const handleAttachmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files) return;

    setAttachments(
      Array.from(e.target.files)
    );
  };

  // 다음 step 이동
  const handleNext = () => {

    if (!formData.country) {
      alert("국가를 선택해주세요");
      return;
    }

    if (!formData.title) {
      alert("강의 제목을 입력해주세요");
      return;
    }

    if (!formData.description) {
      alert("강의 설명을 입력해주세요");
      return;
    }

    if (!formData.price) {
      alert("가격을 입력해주세요");
      return;
    }

    onNext?.();
  };

  return (
    <div className="rounded-[22px] border border-[#E4E7EC] bg-white p-6">

      {/* 제목 */}
      <h2 className="text-[22px] font-bold text-[#111827]">
        기본 정보
      </h2>

      <div className="mt-6 space-y-5">

        {/* 국가 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            국가 선택 *
          </label>

          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none"
          >
            <option value="">
              국가 선택
            </option>

            <option value="일본">
              일본
            </option>

            <option value="프랑스">
              프랑스
            </option>

            <option value="미국">
              미국
            </option>
          </select>
        </div>

        {/* 강의 제목 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            강의 제목 *
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 일본 여행 완벽 가이드"
            className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none"
          />
        </div>

        {/* 설명 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            강의 설명 *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="강의에 대한 간단한 설명을 입력하세요"
            className="mt-2 h-[110px] w-full resize-none rounded-[12px] border border-[#E4E7EC] p-4 text-[14px] outline-none"
          />
        </div>
{/* 썸네일 */}
<div>

  <label className="text-[14px] font-semibold text-[#111827]">
    썸네일 이미지
  </label>

  <div className="mt-2 h-[180px] overflow-hidden rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">

    <img
      src={preview}
      alt="썸네일"
      className="h-full w-full object-cover"
    />
  </div>

  {/* 업로드 버튼 */}
  <label className="mt-3 flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] bg-[#439A97] text-[13px] font-semibold text-white">

    이미지 업로드

    <input
      type="file"
      accept="image/*"
      onChange={handleThumbnailChange}
      className="hidden"
    />
  </label>
</div>
        {/* 가격 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            가격 *
          </label>

          <div className="relative mt-2">

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">
              원
            </span>
          </div>
        </div>

        {/* 마일리지 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            마일리지
          </label>

          <div className="relative mt-2">

            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="0"
              className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">
              원
            </span>
          </div>
        </div>

        {/* 쿠폰 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            사용 가능한 쿠폰
          </label>

          {/* 검색 */}
          <div className="mt-2 flex h-[48px] items-center rounded-[12px] border border-[#E4E7EC] px-4">

            <img
              src="/images/search.svg"
              alt="검색"
              className="h-[16px] w-[16px]"
            />

            <input
              type="text"
              placeholder="쿠폰 검색..."
              value={couponSearch}
              onChange={(e) =>
                setCouponSearch(e.target.value)
              }
              className="ml-2 flex-1 text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          {/* 쿠폰 리스트 */}
          <div className="mt-3 overflow-hidden rounded-[16px] border border-[#E4E7EC]">

            {filteredCoupons.length > 0 ? (

              filteredCoupons.map((coupon) => {

                const selected =
                  selectedCoupons.includes(
                    coupon.id
                  );

                return (
                  <button
                    type="button"
                    key={coupon.id}
                    onClick={() =>
                      handleCouponToggle(
                        coupon.id
                      )
                    }
                    className={`flex w-full items-center justify-between border-b border-[#E4E7EC] px-5 py-4 text-left transition last:border-none ${
                      selected
                        ? "bg-[#F0FDF4]"
                        : "bg-white hover:bg-[#F9FAFB]"
                    }`}
                  >

                    {/* 왼쪽 */}
                    <div className="flex items-center gap-3">

                      {/* 체크 */}
                      <div
                        className={`flex h-[20px] w-[20px] items-center justify-center rounded-full border text-[11px] font-bold ${
                          selected
                            ? "border-[#439A97] bg-[#439A97] text-white"
                            : "border-[#D0D5DD] bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </div>

                      {/* 텍스트 */}
                      <div>

                        <p className="text-[14px] font-semibold text-[#111827]">
                          {coupon.title}
                        </p>

                        <p className="mt-1 text-[12px] text-[#98A2B3]">
                          유효기간: {coupon.expire}
                        </p>
                      </div>
                    </div>

                    {/* 할인율 */}
                    <p className="text-[16px] font-bold text-[#439A97]">
                      {coupon.discount}%
                    </p>
                  </button>
                );
              })

            ) : (

              <div className="px-5 py-8 text-center text-[13px] text-[#98A2B3]">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>

        {/* 첨부파일 */}
        <div>

          <label className="text-[14px] font-semibold text-[#111827]">
            첨부 자료 (선택)
          </label>

          <label className="mt-2 flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">

            <img
              src="/images/upload.svg"
              alt="업로드"
              className="h-[32px] w-[32px]"
            />

            <p className="mt-4 text-[14px] font-medium text-[#344054]">
              PDF, PPT, DOC 업로드
            </p>

            <input
              type="file"
              multiple
              onChange={handleAttachmentChange}
              className="hidden"
            />
          </label>

          {attachments.length > 0 && (

            <div className="mt-3 space-y-1">

              {attachments.map(
                (file, index) => (
                  <p
                    key={index}
                    className="text-[13px] text-[#667085]"
                  >
                    📎 {file.name}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-8 flex items-center justify-end gap-3">

        <button className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085]">
          취소
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white"
        >
          다음
        </button>
      </div>
    </div>
  );
}