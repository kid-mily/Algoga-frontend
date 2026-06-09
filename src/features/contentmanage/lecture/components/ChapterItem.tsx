"use client";

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
}: ChapterItemProps) {
  const titleId = `chapter-${id}-input-title`;
  const descriptionId = `chapter-${id}-input-description`;
  const videoId = `chapter-${id}-video`;

  return (
    <article
      aria-labelledby={`chapter-${id}-heading`}
      className={`rounded-[16px] border bg-white p-4 transition-colors ${
        errors.title || errors.description || errors.video
          ? "border-[#DC2626]"
          : "border-[#E4E7EC]"
      }`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/menu.svg" alt="메뉴" aria-hidden="true" className="h-[12px] w-[12px]" />
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
          <label
            htmlFor={videoId}
            className={`flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed transition-colors ${
              errors.video
                ? "border-[#DC2626] bg-[#FEF2F2]"
                : "border-[#D0D5DD] bg-[#FCFCFD]"
            }`}
          >
            {video ? (
              <div className="flex flex-col items-center">
                <video src={preview} controls className="h-[65px] rounded-[8px]" />
                <p className="mt-2 text-[12px] font-medium text-[#111827]">
                  {video.name}
                </p>
              </div>
            ) : (
              <>
                <img src="/images/upload.svg" alt="업로드" aria-hidden="true" className="h-[22px] w-[22px]" />
                <p className="mt-2 text-[12px] font-semibold text-[#344054]">
                  영상 파일 업로드
                </p>
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  MP4, MOV
                </p>
              </>
            )}
            <input
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
          </label>
          {errors.video && (
            <p id={`${videoId}-error`} className="mt-1 text-[13px] text-[#DC2626]">
              {errors.video}
            </p>
          )}
        </div>
      </fieldset>
    </article>
  );
}
