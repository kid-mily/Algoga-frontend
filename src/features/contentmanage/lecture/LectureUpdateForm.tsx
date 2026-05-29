// src/features/contentmanage/LectureUpdateForm.tsx

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
  };
  onSubmit?: (data: any, thumbnailFile?: File, attachmentFiles?: File[]) => void | Promise<boolean> | boolean; 
}

export default function LectureUpdateForm({
  initialData,
  onSubmit,
}: LectureUpdateFormProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialData);
  
  // 🌟 실제 파일 객체를 담을 state 추가
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(); 
  const [preview, setPreview] = useState("/images/thumb.png");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setThumbnailFile(file); // 🌟 실제 파일 저장
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files)); // 🌟 첨부파일 저장
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      // 🌟 데이터와 함께 파일들도 같이 상위 페이지로 넘겨줍니다.
      const isSuccess = await onSubmit(formData, thumbnailFile, attachments);
      if (isSuccess === false) return; 
    }
    setOpenModal(true);
  };

  return (
    <>
      <div className="rounded-[22px] border border-[#E4E7EC] bg-white p-6">
        <h2 className="text-[22px] font-bold text-[#111827]">강의 수정</h2>

        <div className="mt-6 space-y-5">
          {/* 국가 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">국가 선택 *</label>
            <select name="country" value={formData.country} onChange={handleChange} className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none">
              <option value="">국가 선택</option>
              <option value="일본">일본</option>
              <option value="프랑스">프랑스</option>
              <option value="미국">미국</option>
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">강의 제목 *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="강의 제목 입력" className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none" />
          </div>

          {/* 설명 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">강의 설명 *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="강의 설명 입력" className="mt-2 h-[120px] w-full resize-none rounded-[12px] border border-[#E4E7EC] p-4 text-[14px] outline-none" />
          </div>

          {/* 썸네일 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">썸네일 이미지</label>
            <div className="mt-2 h-[180px] overflow-hidden rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
              <img src={preview} alt="썸네일" className="h-full w-full object-cover" />
            </div>
            <label className="mt-3 flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] bg-[#439A97] text-[13px] font-semibold text-white">
              이미지 변경
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </label>
            {/* 선택된 파일명 표시 */}
            {thumbnailFile && <p className="mt-2 text-[12px] text-[#667085]">{thumbnailFile.name}</p>}
          </div>

          {/* 가격 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">가격 *</label>
            <div className="relative mt-2">
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
            </div>
          </div>

          {/* 마일리지 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">마일리지</label>
            <div className="relative mt-2">
              <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
            </div>
          </div>

          {/* 첨부파일 */}
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">첨부 자료</label>
            <label className="mt-2 flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
              <img src="/images/upload.svg" alt="업로드" className="h-[32px] w-[32px]" />
              <p className="mt-4 text-[14px] font-medium text-[#344054]">PDF, PPT, DOC 업로드</p>
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

        {/* 버튼 */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085]">취소</button>
          <button type="button" onClick={handleSubmit} className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white">수정하기</button>
        </div>
      </div>

      <CompleteModal
        open={openModal}
        title="수정 완료"
        description="강의 수정이 완료되었습니다."
        buttonText="확인"
        onConfirm={() => {
          setOpenModal(false);
          router.push("/contentadmin/lecture");
        }}
      />
    </>
  );
}