"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import CharCounter from "@/features/common/components/CharCounter";
import { LectureUpdateFormProps } from "../types";
import {
  ALLOWED_LECTURE_MATERIAL_ACCEPT,
  getCourseFileDisplayName,
  isAllowedLectureMaterial,
  LECTURE_MATERIAL_TYPE_ERROR_MESSAGE,
} from "../constants";

const LECTURE_TITLE_MAX_LENGTH = 100;
const LECTURE_DESCRIPTION_MAX_LENGTH = 3000;

export default function LectureUpdateForm({ initialData, onSubmit }: LectureUpdateFormProps) {
  const router = useRouter();
  const existingFiles = [...(initialData.files ?? [])].sort(
    (a, b) => a.fileOrder - b.fileOrder
  );
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    isPublic: String(initialData.isPublic) === "true" ? "true" : "false",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [preview, setPreview] = useState(
    initialData.thumbnailUrl || "/images/thumb.png"
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    level: "",
    attachments: "",
  });

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

    if (!file.type.startsWith("image/")) return;

    setPreview(URL.createObjectURL(file));
    setThumbnailFile(file);
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selected = Array.from(event.target.files);
    const invalid = selected.filter((file) => !isAllowedLectureMaterial(file));
    const valid = selected.filter((file) => isAllowedLectureMaterial(file));

    setErrors((prev) => ({
      ...prev,
      attachments:
        invalid.length > 0
          ? `${LECTURE_MATERIAL_TYPE_ERROR_MESSAGE} (${invalid.map((file) => file.name).join(", ")} 제외됨)`
          : "",
    }));
    // 업로드 영역을 여러 번 다시 눌러서 파일을 추가할 수도 있어서, 새로 고른 파일을 기존 목록에 이어 붙입니다.
    setAttachments((prev) => [
      ...prev,
      ...valid.filter(
        (file) =>
          !prev.some(
            (existing) => existing.name === file.name && existing.size === file.size
          )
      ),
    ]);
    event.target.value = "";
  };

  const handleAttachmentRemove = (fileToRemove: File) => {
    setAttachments((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = { title: "", description: "", price: "", level: "", attachments: errors.attachments };
    let hasError = false;

    if (!formData.title.trim()) {
      newErrors.title = "강의 제목을 입력해주세요.";
      hasError = true;
    }
    if (!formData.description.trim()) {
      newErrors.description = "강의 설명을 입력해주세요.";
      hasError = true;
    }
    if (!formData.price || Number(formData.price) < 0) {
      newErrors.price = "올바른 가격을 입력해주세요.";
      hasError = true;
    }
    if (!formData.level) {
      newErrors.level = "강의 난이도를 선택해주세요.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        status: formData.isPublic === "true" ? "PUBLISHED" : "DRAFT",
      };

      try {
        const isSuccess = await onSubmit(payload, thumbnailFile, attachments);
        if (isSuccess === false) return;
      } finally {
        setIsSubmitting(false);
      }
    }
    setOpenModal(true);
  };

  return (
    <>
      <form
        aria-labelledby="lecture-update-form-title"
        className="rounded-[22px] border border-[#E4E7EC] bg-white p-6"
        onSubmit={handleSubmit}
      >
        <header>
          <h2 id="lecture-update-form-title" className="text-[22px] font-bold text-[#111827]">
            강의 수정
          </h2>
        </header>

        <fieldset className="mt-6 space-y-6" disabled={isSubmitting}>
          <legend className="sr-only">강의 수정 입력 영역</legend>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lecture-edit-country" className="text-[14px] font-semibold text-[#111827]">
                국가 선택 *
              </label>
              <div
                id="lecture-edit-country"
                aria-disabled="true"
                className="mt-2 flex h-[48px] w-full cursor-not-allowed items-center rounded-[12px] border border-[#D0D5DD] bg-[#F2F4F7] px-4 text-[14px] font-medium text-[#344054]"
              >
                {formData.country || "국가 정보를 불러오는 중입니다."}
              </div>
            </div>

            <div>
              <label htmlFor="lecture-edit-status" className="text-[14px] font-semibold text-[#111827]">
                상태 *
              </label>
              <select
                id="lecture-edit-status"
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
            <label htmlFor="lecture-edit-title" className="text-[14px] font-semibold text-[#111827]">
              강의 제목 *
            </label>
            <input
              id="lecture-edit-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="강의 제목 입력"
              maxLength={LECTURE_TITLE_MAX_LENGTH}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "lecture-edit-title-error" : undefined}
              className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.title ? (
                <p id="lecture-edit-title-error" className="text-[13px] text-[#DC2626]">
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <CharCounter length={formData.title.length} maxLength={LECTURE_TITLE_MAX_LENGTH} />
            </div>
          </div>

          <div>
            <label htmlFor="lecture-edit-description" className="text-[14px] font-semibold text-[#111827]">
              강의 설명 *
            </label>
            <textarea
              id="lecture-edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="강의 설명 입력"
              maxLength={LECTURE_DESCRIPTION_MAX_LENGTH}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "lecture-edit-description-error" : undefined}
              className={`mt-2 h-[120px] w-full resize-none rounded-[12px] border p-4 text-[14px] outline-none transition-colors ${
                errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.description ? (
                <p id="lecture-edit-description-error" className="text-[13px] text-[#DC2626]">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <CharCounter
                length={formData.description.length}
                maxLength={LECTURE_DESCRIPTION_MAX_LENGTH}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lecture-edit-thumbnail" className="text-[14px] font-semibold text-[#111827]">
              썸네일 이미지
            </label>
            <div className="mt-2 h-[180px] overflow-hidden rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
              <img src={preview} alt="강의 썸네일 미리보기" className="h-full w-full object-cover" />
            </div>
            <label
              htmlFor="lecture-edit-thumbnail"
              className="mt-3 flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] bg-[#439A97] text-[13px] font-semibold text-white hover:opacity-90"
            >
              이미지 변경
              <input id="lecture-edit-thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </label>
            {thumbnailFile && <p className="mt-2 text-[12px] text-[#667085]">{thumbnailFile.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lecture-edit-price" className="text-[14px] font-semibold text-[#111827]">
                가격 *
              </label>
              <div className="relative mt-2">
                <input
                  id="lecture-edit-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "lecture-edit-price-error" : undefined}
                  className={`h-[48px] w-full rounded-[12px] border px-4 pr-10 text-[14px] outline-none transition-colors ${
                    errors.price ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#667085]">원</span>
              </div>
              {errors.price && (
                <p id="lecture-edit-price-error" className="mt-1 text-[13px] text-[#DC2626]">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lecture-edit-mileage" className="text-[14px] font-semibold text-[#111827]">
                최대 지급 마일리지
              </label>
              <div className="relative mt-2">
                <input
                  id="lecture-edit-mileage"
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
              <label htmlFor="lecture-edit-level" className="text-[14px] font-semibold text-[#111827]">
                난이도 *
              </label>
              <select
                id="lecture-edit-level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                aria-invalid={Boolean(errors.level)}
                aria-describedby={errors.level ? "lecture-edit-level-error" : undefined}
                className={`mt-2 h-[48px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                  errors.level ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
                }`}
              >
                <option value="BEGINNER">초급</option>
                <option value="INTERMEDIATE">중급</option>
                <option value="ADVANCED">고급</option>
              </select>
              {errors.level && (
                <p id="lecture-edit-level-error" className="mt-1 text-[13px] text-[#DC2626]">
                  {errors.level}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lecture-edit-attachments" className="text-[14px] font-semibold text-[#111827]">
              첨부 자료
            </label>

            {existingFiles.length > 0 && (
              <ul className="mt-2 space-y-1" aria-label="기존 강의자료">
                {existingFiles.map((file) => (
                  <li key={file.fileUrl} className="text-[13px] text-[#344054]">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#439A97] underline hover:opacity-80"
                    >
                      {getCourseFileDisplayName(file)}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <label
              htmlFor="lecture-edit-attachments"
              className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] transition hover:bg-gray-50"
            >
              <img src="/images/upload.svg" alt="업로드" aria-hidden className="h-[24px] w-[24px]" />
              <span className="mt-2 text-[13px] font-medium text-[#344054]">
                새 강의자료 추가 (PDF, Word, PPT, Excel, HWP, TXT)
              </span>
              <input
                id="lecture-edit-attachments"
                type="file"
                multiple
                accept={ALLOWED_LECTURE_MATERIAL_ACCEPT}
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </label>
            {errors.attachments && (
              <p className="mt-1 text-[13px] text-[#DC2626]">{errors.attachments}</p>
            )}
            {attachments.length > 0 && (
              <ul className="mt-3 space-y-1" aria-label="새로 추가한 첨부 파일">
                {attachments.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between text-[13px] text-[#667085]"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleAttachmentRemove(file)}
                      aria-label={`${file.name} 첨부 취소`}
                      className="ml-2 shrink-0 text-[#98A2B3] hover:text-[#DC2626]"
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        <footer className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="h-[44px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[44px] items-center rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
        </footer>
      </form>

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
