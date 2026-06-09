"use client";

import { useEffect, useState } from "react";
import { CourseCountry } from "../types";
import {
  createLectureAction,
  getLectureCountriesAction,
} from "../actions";

interface LectureFormProps {
  onNext?: (courseId: number) => void;
}

interface CourseFormData {
  countryId: string;
  title: string;
  description: string;
  price: string;
  level: string;
  isPublic: string;
}

export default function LectureForm({ onNext }: LectureFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    countryId: "",
    title: "",
    description: "",
    price: "",
    level: "BEGINNER",
    isPublic: "true",
  });

  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(true);
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [preview, setPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 에러 상태 관리 추가
  const [errors, setErrors] = useState({
    countryId: "",
    title: "",
    description: "",
    price: "",
    level: "",
    thumbnail: "",
  });
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsCountryLoading(true);
        const data = await getLectureCountriesAction();
        setCountries(data);
      } catch (error: any) {
        setGlobalError(error.message || "국가 목록을 불러오지 못했습니다.");
      } finally {
        setIsCountryLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 입력을 시작하면 해당 필드의 에러 메시지 지우기
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "썸네일은 이미지 파일만 업로드할 수 있습니다." }));
      e.target.value = "";
      return;
    }

    setThumbnail(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files));
  };

  const handleNext = async () => {
    // 🌟 유효성 검사 (alert 대신 에러 상태 설정)
    let newErrors = { countryId: "", title: "", description: "", price: "", level: "", thumbnail: "" };
    let hasError = false;

    if (!formData.countryId) { newErrors.countryId = "국가를 선택해주세요."; hasError = true; }
    if (!formData.title.trim()) { newErrors.title = "강의 제목을 입력해주세요."; hasError = true; }
    if (!formData.description.trim()) { newErrors.description = "강의 설명을 입력해주세요."; hasError = true; }
    if (!formData.price || Number(formData.price) < 0 || Number.isNaN(Number(formData.price))) { 
      newErrors.price = "가격은 0원 이상 숫자로 입력해주세요."; hasError = true; 
    }
    if (!formData.level) { newErrors.level = "강의 난이도를 선택해주세요."; hasError = true; }
    if (!thumbnail) { newErrors.thumbnail = "썸네일 이미지를 등록해주세요."; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setGlobalError("");

      const targetStatus = formData.isPublic === "true" ? "PUBLISHED" : "DRAFT";

      const createdCourse = await createLectureAction({
        countryId: Number(formData.countryId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        level: formData.level,
        status: targetStatus,
        thumbnail: thumbnail as File,
        files: attachments.length > 0 ? attachments : undefined,
      });

      if (onNext && createdCourse?.courseId) {
        onNext(createdCourse.courseId);
      } else {
        setGlobalError("강의는 등록되었지만, 정상적인 과정 ID를 반환받지 못했습니다.");
      }
    } catch (error: any) {
      setGlobalError(error.message || "강의 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[20px] border border-[#E4E7EC] bg-white p-6">
      <h2 className="text-[24px] font-bold text-[#111827]">강의 기본 정보</h2>
      <p className="mt-1 text-[15px] text-[#98A2B3]">강의의 뼈대가 되는 기본 정보를 입력합니다</p>

      {/* 🌟 서버 에러 출력 박스 */}
      {globalError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          🚨 {globalError}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">국가 선택 *</label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              disabled={isCountryLoading || isSubmitting}
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.countryId ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            >
              <option value="">국가 선택</option>
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName} {country.continentName ? `(${country.continentName})` : ""}
                </option>
              ))}
            </select>
            {errors.countryId && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.countryId}</p>}
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">상태 (공개 여부) *</label>
            <select
              name="isPublic"
              value={formData.isPublic}
              onChange={handleChange}
              className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#439A97]"
            >
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
            disabled={isSubmitting}
            placeholder="예: 프랑스 파리 여행 완벽 가이드"
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
            disabled={isSubmitting}
            placeholder="강의에 대한 상세한 설명을 입력해주세요"
            className={`mt-2 h-[120px] w-full resize-none rounded-[12px] border p-4 text-[14px] outline-none transition-colors ${
              errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.description && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[14px] font-semibold text-[#111827]">가격 (원) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="예: 50000"
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.price ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            />
            {errors.price && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.price}</p>}
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#111827]">난이도 *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.level ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            >
              <option value="BEGINNER">초급</option>
              <option value="INTERMEDIATE">중급</option>
              <option value="ADVANCED">고급</option>
            </select>
            {errors.level && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.level}</p>}
          </div>
        </div>

        <div>
          <label className="text-[14px] font-semibold text-[#111827]">썸네일 이미지 *</label>
          <label className={`mt-2 flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed transition-colors ${
            errors.thumbnail ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D0D5DD] bg-[#FCFCFD]"
          }`}>
            {preview ? (
              <img src={preview} alt="썸네일" className="h-full w-full rounded-[16px] object-cover" />
            ) : (
              <>
                <img src="/images/upload.svg" alt="업로드" className="h-[32px] w-[32px]" />
                <p className="mt-4 text-[14px] font-medium text-[#344054]">이미지 파일 업로드 (JPG, PNG)</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" disabled={isSubmitting} onChange={handleThumbnailChange} />
          </label>
          {errors.thumbnail && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.thumbnail}</p>}
        </div>

        <div>
          <label className="text-[14px] font-semibold text-[#111827]">첨부 자료 (선택)</label>
          <label className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
            <img src="/images/upload.svg" alt="업로드" className="h-[24px] w-[24px]" />
            <p className="mt-2 text-[13px] font-medium text-[#344054]">PDF, PPT, DOC 업로드</p>
            <input type="file" multiple className="hidden" disabled={isSubmitting} onChange={handleAttachmentChange} />
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

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex h-[48px] items-center rounded-[14px] bg-[#439A97] px-8 text-[15px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "처리 중..." : "다음 단계로"}
        </button>
      </div>
    </div>
  );
}
