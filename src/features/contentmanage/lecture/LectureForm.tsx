// src/features/contentmanage/lecture/LectureForm.tsx

"use client";

import { useEffect, useState } from "react";
import { CourseCountry } from "../types";
import {
  createAdminCourse,
  getCourseCountries,
} from "@/features/services/adminCourse.service";

interface LectureFormProps {
  onNext?: (courseId: number) => void;
}

interface CourseFormData {
  countryId: string;
  title: string;
  description: string;
  price: string;
  level: string;
  isPublic: string; // UI 상에서 선택하는 공개 여부 상태 ("true" or "false")
}

export default function LectureForm({ onNext }: LectureFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    countryId: "",
    title: "",
    description: "",
    price: "",
    level: "BEGINNER",
    isPublic: "true", // 기본값: 공개
  });

  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(true);
  const [countryErrorMessage, setCountryErrorMessage] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [preview, setPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsCountryLoading(true);
        setCountryErrorMessage("");

        const data = await getCourseCountries();
        setCountries(data);
      } catch (error: any) {
        setCountryErrorMessage(
          error.message || "국가 목록을 불러오지 못했습니다."
        );
      } finally {
        setIsCountryLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("썸네일은 이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setThumbnail(file);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files));
  };

  const validateForm = () => {
    if (!formData.countryId) {
      alert("국가를 선택해주세요.");
      return false;
    }
    if (!formData.title.trim()) {
      alert("강의 제목을 입력해주세요.");
      return false;
    }
    if (!formData.description.trim()) {
      alert("강의 설명을 입력해주세요.");
      return false;
    }
    if (!formData.price) {
      alert("가격을 입력해주세요.");
      return false;
    }
    if (Number(formData.price) < 0 || Number.isNaN(Number(formData.price))) {
      alert("가격은 0원 이상 숫자로 입력해주세요.");
      return false;
    }
    if (!formData.level) {
      alert("강의 난이도를 선택해주세요.");
      return false;
    }
    if (!thumbnail) {
      alert("썸네일 이미지를 등록해주세요.");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    if (!thumbnail) {
      alert("썸네일 이미지를 등록해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 🌟 핵심 로직: 폼의 "true"/"false" 값을 백엔드가 원하는 status 문자열로 변환
      const targetStatus = formData.isPublic === "true" ? "PUBLISHED" : "DRAFT";

      const createdCourse = await createAdminCourse({
        countryId: Number(formData.countryId),
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        level: formData.level,
        // 🌟 백엔드에 isPublic 대신 status로 전송!
        status: targetStatus, 
        thumbnail: thumbnail,
        files: attachments,
      } as any);

      const courseId = Number(createdCourse.courseId);

      if (!courseId || Number.isNaN(courseId)) {
        alert("강의는 등록됐지만 courseId를 찾을 수 없습니다.");
        return;
      }

      onNext?.(courseId);
    } catch (error: any) {
      alert(error.message || "강의 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isCountryLoading;

  return (
    <div className="rounded-[22px] border border-[#E4E7EC] bg-white p-6">
      <h2 className="text-[22px] font-bold text-[#111827]">기본 정보</h2>

      <div className="mt-6 space-y-5">
        {/* 국가 선택 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">국가 선택 *</label>
          <select
            name="countryId"
            value={formData.countryId}
            onChange={handleChange}
            disabled={isDisabled || countries.length === 0}
            className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
          >
            <option value="">{isCountryLoading ? "국가 목록 불러오는 중..." : "국가 선택"}</option>
            {countries.map((country) => (
              <option key={country.countryId} value={country.countryId}>
                {country.continentName ? `${country.countryName} (${country.continentName})` : country.countryName}
              </option>
            ))}
          </select>
          {countryErrorMessage && <p className="mt-2 text-[12px] text-[#DC2626]">{countryErrorMessage}</p>}
        </div>

        {/* 강의 제목 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">강의 제목 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isDisabled}
            placeholder="강의 제목을 입력하세요"
            className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
          />
        </div>

        {/* 강의 설명 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">강의 설명 *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isDisabled}
            placeholder="강의에 대한 설명을 입력하세요"
            className="mt-2 h-[110px] w-full resize-none rounded-[12px] border border-[#E4E7EC] p-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
          />
        </div>

        {/* 난이도 & 공개 여부 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">난이도 *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              disabled={isDisabled}
              className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
            >
              <option value="BEGINNER">초급</option>
              <option value="INTERMEDIATE">중급</option>
              <option value="ADVANCED">고급</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">공개 여부 *</label>
            <select
              name="isPublic"
              value={formData.isPublic}
              onChange={handleChange}
              disabled={isDisabled}
              className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
            >
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </div>
        </div>

        {/* 썸네일 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">썸네일 이미지 *</label>
          <div className="mt-2 h-[180px] overflow-hidden rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
            {preview ? (
              <img src={preview} alt="미리보기" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[13px] text-[#98A2B3]">썸네일 이미지를 업로드해주세요.</div>
            )}
          </div>
          <label className={`mt-3 flex h-[42px] items-center justify-center rounded-[10px] text-[13px] font-semibold text-white ${isDisabled ? "cursor-not-allowed bg-[#CFE5E4]" : "cursor-pointer bg-[#439A97]"}`}>
            이미지 업로드
            <input type="file" accept="image/*" onChange={handleThumbnailChange} disabled={isDisabled} className="hidden" />
          </label>
          {thumbnail && <p className="mt-2 text-[13px] text-[#667085]">선택된 파일: {thumbnail.name}</p>}
        </div>

        {/* 가격 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">가격 *</label>
          <div className="relative mt-2">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="0"
              min={0}
              className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none disabled:cursor-not-allowed disabled:bg-[#F2F4F7]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
          </div>
        </div>

        {/* 첨부파일 */}
        <div>
          <label className="text-[14px] font-semibold text-[#111827]">첨부 자료 (선택)</label>
          <label className={`mt-2 flex h-[180px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
            <img src="/images/upload.svg" alt="업로드" className="h-[32px] w-[32px]" />
            <p className="mt-4 text-[14px] font-medium text-[#344054]">PDF, PPT, DOC 업로드</p>
            <input type="file" multiple onChange={handleAttachmentChange} disabled={isDisabled} className="hidden" />
          </label>
          {attachments.length > 0 && (
            <div className="mt-3 space-y-1">
              {attachments.map((file, index) => (
                <p key={`${file.name}-${index}`} className="text-[13px] text-[#667085]">📎 {file.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button type="button" disabled={isDisabled} className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-60">취소</button>
        <button type="button" onClick={handleNext} disabled={isDisabled} className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]">
          {isSubmitting ? "등록 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}