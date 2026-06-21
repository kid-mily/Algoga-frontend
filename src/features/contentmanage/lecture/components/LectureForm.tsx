"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { FormEvent, useEffect, useState } from "react";
import { CourseCountry, CourseFormData, LectureFormProps } from "../types";
import { createLectureAction, getLectureCountriesAction } from "../actions";
import { toNumberOrZero } from "@/features/common/utils/number";

export default function LectureForm({ onNext }: LectureFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    countryId: "",
    title: "",
    description: "",
    price: "",
    mileage: "",
    level: "BEGINNER",
    isPublic: "true",
  });

  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch (error) {
        setGlobalError(error instanceof Error ? error.message : "국가 목록을 불러오지 못했습니다.");
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "이미지 파일만 업로드할 수 있습니다." }));
      event.target.value = "";
      return;
    }

    setThumbnail(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setAttachments(Array.from(event.target.files));
  };

  const handleNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = { countryId: "", title: "", description: "", price: "", level: "", thumbnail: "" };
    let hasError = false;

    if (!formData.countryId) {
      newErrors.countryId = "국가를 선택해주세요.";
      hasError = true;
    }
    if (!formData.title.trim()) {
      newErrors.title = "강의 제목을 입력해주세요.";
      hasError = true;
    }
    if (!formData.description.trim()) {
      newErrors.description = "강의 설명을 입력해주세요.";
      hasError = true;
    }
    if (!formData.price || Number(formData.price) < 0 || Number.isNaN(Number(formData.price))) {
      newErrors.price = "올바른 가격을 입력해주세요.";
      hasError = true;
    }
    if (!formData.level) {
      newErrors.level = "강의 난이도를 선택해주세요.";
      hasError = true;
    }
    if (!thumbnail) {
      newErrors.thumbnail = "썸네일 이미지를 등록해주세요.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setGlobalError("");

      const targetStatus = formData.isPublic === "true" ? "PUBLISHED" : "DRAFT";
      const maxRewardMileage = toNumberOrZero(formData.mileage);
      const createdCourse = await createLectureAction({
        countryId: Number(formData.countryId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        mileage: maxRewardMileage,
        maxRewardMileage,
        level: formData.level,
        status: targetStatus,
        thumbnail: thumbnail as File,
        files: attachments.length > 0 ? attachments : undefined,
      });

      if (onNext && createdCourse?.courseId) {
        onNext(createdCourse.courseId);
      } else {
        setGlobalError("강의는 등록되었지만 강의 ID를 확인하지 못했습니다.");
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "강의 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      aria-labelledby="lecture-form-title"
      className="rounded-[20px] border border-[#E4E7EC] bg-white p-6"
      onSubmit={handleNext}
    >
      <header>
        <h2 id="lecture-form-title" className="text-[24px] font-bold text-[#111827]">
          강의 기본 정보
        </h2>
        <p className="mt-1 text-[15px] text-[#98A2B3]">강의 기본 정보를 입력합니다.</p>
      </header>

      <AdminErrorBanner message={globalError} className="mt-4" />

      <fieldset className="mt-6 space-y-6" disabled={isSubmitting}>
        <legend className="sr-only">강의 기본 정보 입력 영역</legend>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lecture-country" className="text-[14px] font-semibold text-[#111827]">
              국가 선택 *
            </label>
            <select
              id="lecture-country"
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              disabled={isCountryLoading || isSubmitting}
              aria-invalid={Boolean(errors.countryId)}
              aria-describedby={errors.countryId ? "lecture-country-error" : undefined}
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
            {errors.countryId && (
              <p id="lecture-country-error" className="mt-1 text-[13px] text-[#DC2626]">
                {errors.countryId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-status" className="text-[14px] font-semibold text-[#111827]">
              상태 *
            </label>
            <select
              id="lecture-status"
              name="isPublic"
              value={formData.isPublic}
              onChange={handleChange}
              className="mt-2 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#439A97]"
            >
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="lecture-title" className="text-[14px] font-semibold text-[#111827]">
            강의 제목 *
          </label>
          <input
            id="lecture-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="강의 제목 입력"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "lecture-title-error" : undefined}
            className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
              errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.title && (
            <p id="lecture-title-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lecture-description" className="text-[14px] font-semibold text-[#111827]">
            강의 설명 *
          </label>
          <textarea
            id="lecture-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="강의 설명 입력"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "lecture-description-error" : undefined}
            className={`mt-2 h-[120px] w-full resize-none rounded-[12px] border p-4 text-[14px] outline-none transition-colors ${
              errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.description && (
            <p id="lecture-description-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lecture-price" className="text-[14px] font-semibold text-[#111827]">
              가격 *
            </label>
            <input
              id="lecture-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="50000"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "lecture-price-error" : undefined}
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.price ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            />
            {errors.price && (
              <p id="lecture-price-error" className="mt-1 text-[13px] text-[#DC2626]">
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lecture-mileage" className="text-[14px] font-semibold text-[#111827]">
              최대 지급 마일리지
            </label>
            <div className="relative mt-2">
              <input
                id="lecture-mileage"
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 pr-10 text-[14px] outline-none focus:border-[#439A97]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">P</span>
            </div>
          </div>

          <div>
            <label htmlFor="lecture-level" className="text-[14px] font-semibold text-[#111827]">
              난이도 *
            </label>
            <select
              id="lecture-level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              aria-invalid={Boolean(errors.level)}
              aria-describedby={errors.level ? "lecture-level-error" : undefined}
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.level ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            >
              <option value="BEGINNER">초급</option>
              <option value="INTERMEDIATE">중급</option>
              <option value="ADVANCED">고급</option>
            </select>
            {errors.level && (
              <p id="lecture-level-error" className="mt-1 text-[13px] text-[#DC2626]">
                {errors.level}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lecture-thumbnail" className="text-[14px] font-semibold text-[#111827]">
            썸네일 이미지 *
          </label>
          <label
            htmlFor="lecture-thumbnail"
            className={`mt-2 flex h-[180px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed transition-colors ${
              errors.thumbnail ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D0D5DD] bg-[#FCFCFD]"
            }`}
          >
            {preview ? (
              <img src={preview} alt="강의 썸네일 미리보기" className="h-full w-full rounded-[16px] object-cover" />
            ) : (
              <>
                <img src="/images/upload.svg" alt="업로드" aria-hidden className="h-[32px] w-[32px]" />
                <span className="mt-4 text-[14px] font-medium text-[#344054]">이미지 파일 업로드 (JPG, PNG)</span>
              </>
            )}
            <input
              id="lecture-thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={errors.thumbnail ? "lecture-thumbnail-error" : undefined}
              onChange={handleThumbnailChange}
            />
          </label>
          {errors.thumbnail && (
            <p id="lecture-thumbnail-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.thumbnail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lecture-attachments" className="text-[14px] font-semibold text-[#111827]">
            첨부 자료
          </label>
          <label
            htmlFor="lecture-attachments"
            className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]"
          >
            <img src="/images/upload.svg" alt="업로드" aria-hidden className="h-[24px] w-[24px]" />
            <span className="mt-2 text-[13px] font-medium text-[#344054]">PDF, PPT, DOC 업로드</span>
            <input id="lecture-attachments" type="file" multiple className="hidden" onChange={handleAttachmentChange} />
          </label>
          {attachments.length > 0 && (
            <ul className="mt-3 space-y-1" aria-label="선택된 첨부 파일">
              {attachments.map((file) => (
                <li key={file.name} className="text-[13px] text-[#667085]">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      <footer className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[48px] items-center rounded-[14px] bg-[#439A97] px-8 text-[15px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "처리 중..." : "다음 단계로"}
        </button>
      </footer>
    </form>
  );
}
