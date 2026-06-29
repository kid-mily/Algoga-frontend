"use client";

import Image from "next/image";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import { useChapterForm } from "../hooks/useChapterForm";
import type { ChapterFormProps } from "../types";

export default function ChapterForm({
  mode = "create",
  initialChapter = {
    id: 0,
    title: "",
    description: "",
    duration: "",
    video: null,
    preview: "",
  },
  onClose,
  onSubmit,
}: ChapterFormProps) {
  const {
    errors,
    fileInputRef,
    form,
    hasVideo,
    isSubmitting,
    modalType,
    submitError,
    clearFieldError,
    handleSubmit,
    handleVideoRemove,
    handleVideoUpload,
    setModalType,
    updateForm,
  } = useChapterForm({ initialChapter, onSubmit });
  const isCreateMode = mode === "create";

  return (
    <form
      aria-labelledby="chapter-form-title"
      className="mt-8 rounded-[20px] border border-[#E4E7EC] bg-white p-5"
      onSubmit={handleSubmit}
    >
      <header className="flex items-start justify-between">
        <div>
          <h2 id="chapter-form-title" className="text-[22px] font-bold text-[#111827]">
            {isCreateMode ? "챕터 추가" : "챕터 수정"}
          </h2>
          <p className="mt-1 text-[14px] text-[#98A2B3]">
            {isCreateMode ? "새로운 강의 챕터를 추가합니다." : "챕터 정보를 수정합니다."}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] text-[#98A2B3] transition hover:text-[#111827]"
            aria-label="챕터 폼 닫기"
          >
            x
          </button>
        )}
      </header>

      <AdminErrorBanner message={submitError} className="mt-4" />

      <fieldset className="mt-6 space-y-4" disabled={isSubmitting}>
        <legend className="sr-only">챕터 정보 입력 영역</legend>

        <div>
          <label htmlFor="chapter-title" className="text-[13px] font-semibold text-[#344054]">
            챕터 제목
          </label>
          <input
            id="chapter-title"
            type="text"
            value={form.title}
            onChange={(event) => {
              updateForm("title", event.target.value);
              clearFieldError("title");
            }}
            placeholder="챕터 제목 입력"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "chapter-title-error" : undefined}
            className={`mt-2 h-[42px] w-full rounded-[10px] border px-4 text-[13px] outline-none transition-colors ${
              errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.title && (
            <p id="chapter-title-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="chapter-description" className="text-[13px] font-semibold text-[#344054]">
            챕터 설명
          </label>
          <textarea
            id="chapter-description"
            value={form.description}
            onChange={(event) => {
              updateForm("description", event.target.value);
              clearFieldError("description");
            }}
            placeholder="챕터 설명 입력"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "chapter-description-error" : undefined}
            className={`mt-2 h-[90px] w-full resize-none rounded-[10px] border p-4 text-[13px] outline-none transition-colors ${
              errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.description && (
            <p id="chapter-description-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <span className="text-[13px] font-semibold text-[#344054]">
            강의 영상
          </span>
          <div
            className={`relative mt-2 flex h-[120px] flex-col items-center justify-center rounded-[14px] border border-dashed transition-colors ${
              errors.video ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D0D5DD] bg-[#FCFCFD]"
            }`}
          >
            {hasVideo ? (
              <span className="flex flex-col items-center">
                <video src={form.preview} controls className="h-[65px] rounded-[8px]" aria-label="챕터 영상 미리보기" />
                <span className="mt-2 max-w-[260px] truncate text-[12px] font-medium text-[#111827]">
                  {form.video ? form.video.name : "기존 영상"}
                </span>
                <button
                  type="button"
                  onClick={() => setModalType("videoDelete")}
                  className="absolute right-3 top-3 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#FCA5A5] bg-white shadow-sm transition hover:bg-[#FEF2F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]"
                  aria-label="챕터 영상 삭제"
                >
                  <Image src="/images/delete.svg" alt="" width={15} height={15} aria-hidden="true" />
                </button>
              </span>
            ) : (
              <label htmlFor="chapter-video" className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                <Image src="/images/upload.svg" alt="" width={22} height={22} aria-hidden="true" />
                <span className="mt-2 text-[12px] font-semibold text-[#344054]">영상 파일 업로드</span>
              </label>
            )}
            <input
              ref={fileInputRef}
              id="chapter-video"
              type="file"
              accept="video/*"
              className="hidden"
              aria-invalid={Boolean(errors.video)}
              aria-describedby={errors.video ? "chapter-video-error" : undefined}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                handleVideoUpload(file);
              }}
            />
          </div>
          {errors.video && (
            <p id="chapter-video-error" className="mt-1 text-[13px] text-[#DC2626]">
              {errors.video}
            </p>
          )}
        </div>
      </fieldset>

      <footer className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-[42px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex h-[42px] items-center justify-center rounded-[12px] px-6 text-[14px] font-semibold text-white transition-colors hover:opacity-90 ${
            isSubmitting ? "cursor-not-allowed bg-[#98A2B3]" : "bg-[#439A97]"
          }`}
        >
          {isSubmitting ? "처리 중..." : isCreateMode ? "챕터 추가" : "챕터 수정"}
        </button>
      </footer>

      <CompleteModal
        open={modalType === "complete"}
        title={isCreateMode ? "등록 완료" : "수정 완료"}
        description={isCreateMode ? "챕터가 등록되었습니다." : "챕터가 수정되었습니다."}
        buttonText="확인"
        onConfirm={() => {
          setModalType(null);
          if (isCreateMode) window.location.reload();
          else onClose?.();
        }}
      />
      <Modal
        open={modalType === "videoDelete"}
        title="영상 삭제"
        description="선택한 영상을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onCancel={() => setModalType(null)}
        onConfirm={() => {
          handleVideoRemove();
          setModalType(null);
        }}
      />
    </form>
  );
}
