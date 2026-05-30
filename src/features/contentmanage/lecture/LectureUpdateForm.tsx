"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";

interface LectureUpdateFormProps {
  initialData: {
    country: string;
    title: string;
    description: string;
    price: string;
    mileage: string;
    isPublic?: string; 
  };
  onSubmit?: (data: any, thumbnailFile?: File, attachmentFiles?: File[]) => void | Promise<boolean> | boolean; 
}

export default function LectureUpdateForm({
  initialData,
  onSubmit,
}: LectureUpdateFormProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ...initialData,
    isPublic: String(initialData.isPublic) === "true" ? "true" : "false", 
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(); 
  const [preview, setPreview] = useState("/images/thumb.png");
  const [attachments, setAttachments] = useState<File[]>([]);

  // 🌟 인라인 에러 상태
  const [errors, setErrors] = useState({
    country: "",
    title: "",
    description: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      return;
    }

    setPreview(URL.createObjectURL(file));
    setThumbnailFile(file); 
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files)); 
  };

  const handleSubmit = async () => {
    // 🌟 유효성 검사
    let newErrors = { country: "", title: "", description: "", price: "" };
    let hasError = false;

    if (!formData.country) { newErrors.country = "국가를 선택해주세요."; hasError = true; }
    if (!formData.title.trim()) { newErrors.title = "강의 제목을 입력해주세요."; hasError = true; }
    if (!formData.description.trim()) { newErrors.description = "강의 설명을 입력해주세요."; hasError = true; }
    if (!formData.price || Number(formData.price) < 0) { newErrors.price = "올바른 가격을 입력해주세요."; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      const isPublicBool = String(formData.isPublic) === "true";
      const payload = {
        ...formData,
        isPublic: isPublicBool,
        status: isPublicBool ? "PUBLISHED" : "DRAFT",
      };

      try {
        const isSuccess = await onSubmit(payload, thumbnailFile, attachments);
        if (isSuccess === false) {
          setIsSubmitting(false);
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }
    setOpenModal(true);
  };

  return (
    <>
      <div className="rounded-[22px] border border-[#E4E7EC] bg-white p-6">
        <h2 className="text-[22px] font-bold text-[#111827]">강의 수정</h2>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">국가 선택 *</label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange} 
                className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                  errors.country ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
                }`}
              >
                <option value="">국가 선택</option>
                <option value="일본">일본</option>
                <option value="프랑스">프랑스</option>
                <option value="미국">미국</option>
              </select>
              {errors.country && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.country}</p>}
            </div>
            
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">상태 (공개 여부) *</label>
              <select name="isPublic" value={formData.isPublic} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#439A97]">
                <option value="true">공개 (PUBLISHED)</option>
                <option value="false">비공개 (DRAFT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">강의 제목 *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="강의 제목 입력" 
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`} 
            />
            {errors.title && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.title}</p>}
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">강의 설명 *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="강의 설명 입력" 
              className={`mt-2 h-[120px] w-full resize-none rounded-[12px] border p-4 text-[14px] outline-none transition-colors ${
                errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`} 
            />
            {errors.description && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.description}</p>}
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">썸네일 이미지</label>
            <div className="mt-2 h-[180px] overflow-hidden rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
              <img src={preview} alt="썸네일" className="h-full w-full object-cover" />
            </div>
            <label className="mt-3 flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] bg-[#439A97] text-[13px] font-semibold text-white hover:opacity-90">
              이미지 변경
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </label>
            {thumbnailFile && <p className="mt-2 text-[12px] text-[#667085]">{thumbnailFile.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-[#111827]">가격 *</label>
              <div className="relative mt-2">
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className={`h-[48px] w-full rounded-[12px] border px-4 pr-10 text-[14px] outline-none transition-colors ${
                    errors.price ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
                  }`} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
              </div>
              {errors.price && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.price}</p>}
            </div>

            <div>
              <label className="text-[14px] font-semibold text-[#111827]">마일리지</label>
              <div className="relative mt-2">
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none focus:border-[#439A97]" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">첨부 자료</label>
            <label className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] transition hover:bg-gray-50">
              <img src="/images/upload.svg" alt="업로드" className="h-[24px] w-[24px]" />
              <p className="mt-2 text-[13px] font-medium text-[#344054]">PDF, PPT, DOC 업로드</p>
              <input type="file" multiple onChange={handleAttachmentChange} className="hidden" />
            </label>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-1">
                {attachments.map((file, index) => (
                  <p key={index} className="text-[13px] text-[#667085]">📎 {file.name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] hover:bg-gray-50 disabled:opacity-50">취소</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]">
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </div>

      <CompleteModal
        open={openModal}
        title="수정 완료"
        description="강의 수정이 완료되었습니다."
        buttonText="확인"
        onConfirm={() => {
          setOpenModal(false);
          router.refresh(); 
          router.push("/contentadmin/lecture");
        }}
      />
    </>
  );
}