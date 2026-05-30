"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";
import { getAdminCourses } from "@/features/services/adminCourse.service"; 

interface CouponFormProps {
  initialData?: {
    courseId: string;
    couponName: string;
    discountType: string;
    discountValue: string;
    validDays: string;
    active: string; 
  };
  onSubmit: (data: any) => Promise<boolean> | boolean;
  isEdit?: boolean;
}

export default function CouponForm({ initialData, onSubmit, isEdit = false }: CouponFormProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    courseId: initialData?.courseId || "",
    couponName: initialData?.couponName || "",
    discountType: initialData?.discountType || "RATE",
    discountValue: initialData?.discountValue || "",
    validDays: initialData?.validDays || "",
    active: initialData?.active === "false" ? "false" : "true", 
  });

  // 🌟 에러 메시지를 관리할 State 추가
  const [errors, setErrors] = useState({
    courseId: "",
    couponName: "",
    discountValue: "",
    validDays: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAdminCourses();
        setCourses(data);
      } catch (error) {
        console.error("강의 목록 로드 실패", error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 사용자가 다시 입력을 시작하면 해당 에러 메시지를 지워줌
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    // 🌟 1. 유효성 검사 (alert 대신 에러 state에 메시지 저장)
    let newErrors = { courseId: "", couponName: "", discountValue: "", validDays: "" };
    let hasError = false;

    if (!formData.courseId) {
      newErrors.courseId = "연결할 강의를 선택해주세요.";
      hasError = true;
    }
    if (!formData.couponName.trim()) {
      newErrors.couponName = "쿠폰 이름은 필수 입력입니다.";
      hasError = true;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      newErrors.discountValue = "올바른 할인 폭을 입력해주세요.";
      hasError = true;
    }
    if (!formData.validDays || Number(formData.validDays) <= 0) {
      newErrors.validDays = "올바른 유효 기간을 입력해주세요.";
      hasError = true;
    }

    // 에러가 하나라도 있다면 상태를 업데이트하고 중단
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // 🌟 2. 에러가 없으면 백엔드로 전송
    const payload = {
      courseId: Number(formData.courseId),
      couponName: formData.couponName.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      validDays: Number(formData.validDays),
      active: formData.active === "true", 
    };

    const isSuccess = await onSubmit(payload);
    if (isSuccess) {
      setOpenModal(true);
    }
  };

  return (
    <>
      <div className="rounded-[22px] border border-[#E4E7EC] bg-white p-6">
        <h2 className="text-[22px] font-bold text-[#111827]">
          {isEdit ? "쿠폰 수정" : "새 쿠폰 등록"}
        </h2>

        <div className="mt-6 space-y-6"> {/* 간격을 조금 더 넓게(y-6) 조정했습니다 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">연결할 강의 선택 *</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                disabled={isEdit}
                className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                  errors.courseId ? "border-[#DC2626] bg-[#FEF2F2]" : isEdit ? "bg-[#F2F4F7] border-transparent text-[#98A2B3] cursor-not-allowed" : "border-[#E4E7EC] focus:border-[#439A97]"
                }`}
              >
                <option value="">강의를 선택해주세요</option>
                {courses.map((course) => {
                  const id = course.courseId || course.course_id || course.id;
                  return <option key={id} value={id}>{course.title}</option>;
                })}
              </select>
              {/* 🚨 에러 메시지 노출 */}
              {errors.courseId && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.courseId}</p>}
            </div>
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">상태 *</label>
              <select name="active" value={formData.active} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#439A97]">
                <option value="true">활성 (발급 가능)</option>
                <option value="false">비활성 (발급 중지)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">쿠폰 이름 *</label>
            <input 
              type="text" 
              name="couponName" 
              value={formData.couponName} 
              onChange={handleChange} 
              placeholder="예: 오사카 강의 수료 할인 쿠폰" 
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.couponName ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`} 
            />
            {/* 🚨 에러 메시지 노출 */}
            {errors.couponName && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.couponName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">할인 타입 *</label>
              <select name="discountType" value={formData.discountType} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#439A97]">
                <option value="RATE">비율 할인 (%)</option>
                <option value="AMOUNT">정액 할인 (원)</option>
              </select>
            </div>
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">할인 폭 *</label>
              <input 
                type="number" 
                name="discountValue" 
                value={formData.discountValue} 
                onChange={handleChange} 
                placeholder="예: 10" 
                className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                  errors.discountValue ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
                }`} 
              />
              {/* 🚨 에러 메시지 노출 */}
              {errors.discountValue && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.discountValue}</p>}
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">유효 기간 (일) *</label>
            <input 
              type="number" 
              name="validDays" 
              value={formData.validDays} 
              onChange={handleChange} 
              placeholder="예: 30" 
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.validDays ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`} 
            />
            {/* 🚨 에러 메시지 노출 */}
            {errors.validDays && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.validDays}</p>}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] hover:bg-gray-50">취소</button>
          <button type="button" onClick={handleSubmit} className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white hover:opacity-90">
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>

      <CompleteModal
        open={openModal}
        title={isEdit ? "수정 완료" : "등록 완료"}
        description={`쿠폰이 성공적으로 ${isEdit ? "수정" : "등록"}되었습니다.`}
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