"use client";

interface ChapterItemProps {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;
  errors?: {
    title?: string;
    description?: string;
    video?: string;
  };
  onRemove: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onVideoUpload: (file: File) => void;
}

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
  return (
    <div className={`rounded-[16px] border bg-white p-4 transition-colors ${errors.title || errors.description || errors.video ? "border-[#DC2626]" : "border-[#E4E7EC]"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/menu.svg" alt="이동" className="h-[12px] w-[12px]" />
          <h3 className="text-[15px] font-semibold text-[#111827]">Chapter {id}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F9FAFB] text-[13px] text-[#98A2B3] transition hover:bg-[#FEE4E2] hover:text-[#D92D20]"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <input
            type="text"
            placeholder="챕터 제목"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`h-[42px] w-full rounded-[10px] border px-4 text-[13px] outline-none transition-colors ${errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"}`}
          />
          {errors.title && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.title}</p>}
        </div>

        <div>
          <textarea
            placeholder="챕터 설명"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={`h-[82px] w-full resize-none rounded-[10px] border p-4 text-[13px] outline-none transition-colors ${errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"}`}
          />
          {errors.description && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.description}</p>}
        </div>

        <div>
          <label className={`flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed transition-colors ${errors.video ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D0D5DD] bg-[#FCFCFD]"}`}>
            {video ? (
              <div className="flex flex-col items-center">
                <video src={preview} controls className="h-[65px] rounded-[8px]" />
                <p className="mt-2 text-[12px] font-medium text-[#111827]">{video.name}</p>
              </div>
            ) : (
              <>
                <img src="/images/upload.svg" alt="업로드" className="h-[22px] w-[22px]" />
                <p className="mt-2 text-[12px] font-semibold text-[#344054]">영상 파일 업로드</p>
                <p className="mt-1 text-[11px] text-[#98A2B3]">MP4, MOV (최대 500MB)</p>
              </>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onVideoUpload(file);
              }}
            />
          </label>
          {errors.video && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.video}</p>}
        </div>
      </div>
    </div>
  );
}