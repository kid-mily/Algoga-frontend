"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Modal from "@/features/common/components/Modal";
import { ChapterItemProps } from "../types";

export default function ChapterItem({
  id,
  title,
  description,
  video,
  preview,
  errors = {},
  onRemove,
  onTitleChange,
  onDescriptionChange,
  onVideoUpload,
  onVideoRemove,
}: ChapterItemProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openVideoDeleteModal, setOpenVideoDeleteModal] = useState(false);
  const titleId = `chapter-${id}-input-title`;
  const descriptionId = `chapter-${id}-input-description`;
  const videoId = `chapter-${id}-video`;
  const hasVideo = Boolean(video && preview);

  const handleVideoRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onVideoRemove();
  };

  return (
    <article
      aria-labelledby={`chapter-${id}-heading`}
      className="rounded-[16px] border border-[#E4E7EC] bg-white p-4"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/images/menu.svg" alt="" width={12} height={12} aria-hidden="true" />
          <h3 id={`chapter-${id}-heading`} className="text-[15px] font-semibold text-[#111827]">
            챕터 {id}
          </h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${id}번 챕터 삭제`}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F9FAFB] text-[13px] text-[#98A2B3] transition hover:bg-[#FEE4E2] hover:text-[#D92D20]"
        >
          x
        </button>
      </header>

      <fieldset className="mt-4 space-y-4">
        <legend className="sr-only">{id}번 챕터 정보</legend>

        <div>
          <label htmlFor={titleId} className="sr-only">
            챕터 제목
          </label>
          <input
            id={titleId}
            type="text"
            placeholder="챕터 제목"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${titleId}-error` : undefined}
            className={`h-[42px] w-full rounded-[10px] border px-4 text-[13px] outline-none transition-colors ${
              errors.title
                ? "border-[#DC2626] bg-[#FEF2F2]"
                : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.title && (
            <p id={`${titleId}-error`} className="mt-1 text-[13px] text-[#DC2626]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={descriptionId} className="sr-only">
            챕터 설명
          </label>
          <textarea
            id={descriptionId}
            placeholder="챕터 설명"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? `${descriptionId}-error` : undefined}
            className={`h-[82px] w-full resize-none rounded-[10px] border p-4 text-[13px] outline-none transition-colors ${
              errors.description
                ? "border-[#DC2626] bg-[#FEF2F2]"
                : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {errors.description && (
            <p id={`${descriptionId}-error`} className="mt-1 text-[13px] text-[#DC2626]">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <div
            className={`relative flex h-[120px] flex-col items-center justify-center rounded-[14px] border border-dashed transition-colors ${
              errors.video
                ? "border-[#DC2626] bg-[#FEF2F2]"
                : "border-[#D0D5DD] bg-[#FCFCFD]"
            }`}
          >
            {hasVideo ? (
              <div className="flex flex-col items-center">
                <video src={preview} controls className="h-[65px] rounded-[8px]" />
                <p className="mt-2 max-w-[220px] truncate text-[12px] font-medium text-[#111827]">
                  {video?.name}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenVideoDeleteModal(true)}
                  className="absolute right-3 top-3 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#FCA5A5] bg-white shadow-sm transition hover:bg-[#FEF2F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]"
                  aria-label={`${id}번 챕터 영상 삭제`}
                >
                  <Image src="/images/delete.svg" alt="" width={15} height={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <label htmlFor={videoId} className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                <Image src="/images/upload.svg" alt="" width={22} height={22} aria-hidden="true" />
                <p className="mt-2 text-[12px] font-semibold text-[#344054]">
                  영상 파일 업로드
                </p>
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  MP4, MOV
                </p>
              </label>
            )}
            <input
              ref={fileInputRef}
              id={videoId}
              type="file"
              accept="video/*"
              className="hidden"
              aria-invalid={Boolean(errors.video)}
              aria-describedby={errors.video ? `${videoId}-error` : undefined}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                onVideoUpload(file);
              }}
            />
          </div>
          {errors.video && (
            <p id={`${videoId}-error`} className="mt-1 text-[13px] text-[#DC2626]">
              {errors.video}
            </p>
          )}
        </div>
      </fieldset>
      <Modal
        open={openVideoDeleteModal}
        title="영상 삭제"
        description="선택한 영상을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onCancel={() => setOpenVideoDeleteModal(false)}
        onConfirm={() => {
          handleVideoRemove();
          setOpenVideoDeleteModal(false);
        }}
      />
    </article>
  );
}

