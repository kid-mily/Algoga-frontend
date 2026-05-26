"use client";

interface ChapterItemProps {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;

  onRemove: () => void;

  onTitleChange: (
    value: string
  ) => void;

  onDescriptionChange: (
    value: string
  ) => void;

  onVideoUpload: (
    file: File
  ) => void;
}

export default function ChapterItem({
  id,
  title,
  description,
  video,
  preview,

  onRemove,
  onTitleChange,
  onDescriptionChange,
  onVideoUpload,
}: ChapterItemProps) {

  return (
    <div className="rounded-[14px] border border-[#E4E7EC] p-4">

      {/* 상단 */}
      <div className="flex items-center justify-between">

        {/* 왼쪽 */}
        <div className="flex items-center gap-2">

          <img
            src="/images/menu.svg"
            alt="이동"
            className="h-[13px] w-[13px]"
          />

          <h3 className="text-[16px] font-semibold text-[#111827]">
            Chapter {id}
          </h3>
        </div>

        {/* 삭제 */}
        <button
          type="button"
          onClick={onRemove}
          className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#F9FAFB] text-[14px] text-[#98A2B3] transition hover:bg-[#FEE4E2] hover:text-[#D92D20]"
        >
          ✕
        </button>
      </div>

      {/* 입력 */}
      <div className="mt-4 space-y-3">

        {/* 제목 */}
        <input
          type="text"
          placeholder="챕터 제목"
          value={title}
          onChange={(e) =>
            onTitleChange(
              e.target.value
            )
          }
          className="h-[42px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[13px] outline-none"
        />

        {/* 설명 */}
        <textarea
          placeholder="챕터 설명"
          value={description}
          onChange={(e) =>
            onDescriptionChange(
              e.target.value
            )
          }
          className="h-[88px] w-full resize-none rounded-[10px] border border-[#E4E7EC] p-4 text-[13px] outline-none"
        />

        {/* 업로드 */}
        <label className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">

          {video ? (

            <div className="flex flex-col items-center">

              <video
                src={preview}
                controls
                className="h-[70px] rounded-[8px]"
              />

              <p className="mt-2 text-[12px] font-medium text-[#111827]">
                {video.name}
              </p>
            </div>

          ) : (
            <>
              <img
                src="/images/upload.svg"
                alt="업로드"
                className="h-[24px] w-[24px]"
              />

              <p className="mt-2 text-[12px] font-semibold text-[#344054]">
                영상 파일 업로드
              </p>

              <p className="mt-1 text-[11px] text-[#98A2B3]">
                MP4, MOV (최대 500MB)
              </p>
            </>
          )}

          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {

              const file =
                e.target.files?.[0];

              if (!file) return;

              onVideoUpload(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}