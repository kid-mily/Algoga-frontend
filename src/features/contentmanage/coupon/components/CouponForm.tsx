"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import type { CouponFormData, CouponFormProps } from "../types";

export default function CouponForm({
  courses,
  initialData,
  onSubmit,
  isEdit = false,
}: CouponFormProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    courseId: initialData?.courseId || "",
    couponName: initialData?.couponName || "",
    percent: initialData?.percent || "",
    active: initialData?.active === "false" ? "false" : "true",
  });
  const [errors, setErrors] = useState({
    courseId: "",
    couponName: "",
    percent: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      courseId: "",
      couponName: "",
      percent: "",
    };
    let hasError = false;

    if (!formData.courseId) {
      newErrors.courseId = "연결할 강의를 선택해주세요.";
      hasError = true;
    }

    if (!formData.couponName.trim()) {
      newErrors.couponName = "쿠폰 이름을 입력해주세요.";
      hasError = true;
    }

    const percentValue = Number(formData.percent);

    if (!formData.percent || percentValue <= 0 || percentValue > 100) {
      newErrors.percent = "할인율은 1~100 사이로 입력해주세요.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const isSuccess = await onSubmit({
      courseId: Number(formData.courseId),
      couponName: formData.couponName.trim(),
      percent: percentValue,
      validDays: 30,
      active: formData.active === "true",
    });

    if (isSuccess) {
      setOpenModal(true);
    }
  };

  return (
    <>
      <form
        aria-labelledby="coupon-form-title"
        className="rounded-[22px] border border-[#E4E7EC] bg-white p-6"
        onSubmit={handleSubmit}
      >
        <h2 id="coupon-form-title" className="text-[22px] font-bold text-[#111827]">
          {isEdit ? "쿠폰 수정" : "쿠폰 등록"}
        </h2>

        <fieldset className="mt-6 space-y-6">
          <legend className="sr-only">쿠폰 정보 입력 영역</legend>

          <section className="grid grid-cols-2 gap-4" aria-label="쿠폰 연결 강의와 상태">
            <section>
              <label htmlFor="coupon-course" className="text-[14px] font-semibold text-[#111827]">
                연결할 강의 선택 *
              </label>
              <select
                id="coupon-course"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                disabled={isEdit}
                aria-invalid={Boolean(errors.courseId)}
                className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
              >
                <option value="">강의를 선택해주세요</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.courseId}</p>}
            </section>

            <section>
              <label htmlFor="coupon-active" className="text-[14px] font-semibold text-[#111827]">
                상태 *
              </label>
              <select
                id="coupon-active"
                name="active"
                value={formData.active}
                onChange={handleChange}
                className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none"
              >
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </select>
            </section>
          </section>

          <section aria-label="쿠폰 이름">
            <label htmlFor="coupon-name" className="text-[14px] font-semibold text-[#111827]">
              쿠폰 이름 *
            </label>
            <input
              id="coupon-name"
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleChange}
              placeholder="예: 강의 수료 할인 쿠폰"
              className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none"
            />
            {errors.couponName && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.couponName}</p>}
          </section>

          <section aria-label="쿠폰 할인율">
            <label htmlFor="coupon-percent" className="text-[14px] font-semibold text-[#111827]">
              할인율(%) *
            </label>
            <div className="relative mt-2">
              <input
                id="coupon-percent"
                type="number"
                name="percent"
                min={1}
                max={100}
                value={formData.percent}
                onChange={handleChange}
                aria-invalid={Boolean(errors.percent)}
                placeholder="예: 10"
                className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">
                %
              </span>
            </div>
            {errors.percent && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.percent}</p>}
          </section>
        </fieldset>

        <footer className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085]"
          >
            취소
          </button>
          <button
            type="submit"
            className="h-[44px] rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white"
          >
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </footer>
      </form>

      <CompleteModal
        open={openModal}
        title={isEdit ? "수정 완료" : "등록 완료"}
        description={isEdit ? "쿠폰이 수정되었습니다." : "쿠폰이 등록되었습니다."}
        buttonText="확인"
        onConfirm={() => {
          setOpenModal(false);
          router.refresh();
          router.push("/contentadmin/coupon");
        }}
      />
    </>
  );
}
