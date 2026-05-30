"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";

// 🌟 등록 폼에서도 강의 목록을 불러오기 위해 추가
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
  
  const [courses, setCourses] = useState<any[]>([]); // 🌟 드롭다운용 강의 목록

  const [formData, setFormData] = useState({
    courseId: initialData?.courseId || "",
    couponName: initialData?.couponName || "",
    discountType: initialData?.discountType || "RATE",
    discountValue: initialData?.discountValue || "",
    validDays: initialData?.validDays || "",
    active: initialData?.active === "false" ? "false" : "true", 
  });

  // 🌟 컴포넌트 렌더링 시 강의 목록 가져오기
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
  };

  const handleSubmit = async () => {
    if (!formData.courseId) {
      alert("연결할 강의를 선택해주세요.");
      return;
    }
    if (!formData.couponName.trim() || !formData.discountValue || !formData.validDays) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const payload = {
      courseId: Number(formData.courseId), // 백엔드로는 정상적으로 Number 타입 ID가 넘어갑니다!
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

        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">연결할 강의 선택 *</label>
              {/* 🌟 숫자 입력창 대신 드롭다운으로 변경 */}
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                disabled={isEdit} // 수정 시에는 강의 변경 불가
                className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none ${isEdit ? "bg-[#F2F4F7] border-transparent text-[#98A2B3] cursor-not-allowed" : "border-[#E4E7EC]"}`}
              >
                <option value="">강의를 선택해주세요</option>
                {courses.map((course) => {
                  const id = course.courseId || course.course_id || course.id;
                  return (
                    <option key={id} value={id}>
                      {course.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">상태 *</label>
              <select name="active" value={formData.active} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none">
                <option value="true">활성 (발급 가능)</option>
                <option value="false">비활성 (발급 중지)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">쿠폰 이름 *</label>
            <input type="text" name="couponName" value={formData.couponName} onChange={handleChange} placeholder="예: 오사카 강의 수료 할인 쿠폰" className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">할인 타입 *</label>
              <select name="discountType" value={formData.discountType} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none">
                <option value="RATE">비율 할인 (%)</option>
                <option value="AMOUNT">정액 할인 (원)</option>
              </select>
            </div>
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">할인 폭 *</label>
              <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} placeholder="예: 10" className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">유효 기간 (일) *</label>
            <input type="number" name="validDays" value={formData.validDays} onChange={handleChange} placeholder="예: 30" className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085]">취소</button>
          <button type="button" onClick={handleSubmit} className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white">
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