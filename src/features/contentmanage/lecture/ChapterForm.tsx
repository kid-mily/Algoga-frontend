"use client";

import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";

type ChapterFormMode = "create" | "edit";

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  video: File | null;
  preview: string;
}

interface ChapterFormProps {
  mode?: ChapterFormMode;
  initialChapter?: Chapter;
  onClose?: () => void;
  onSubmit?: (data: any) => Promise<boolean> | boolean | void;
}

const getVideoDurationSeconds = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = Math.floor(video.duration);
      if (!duration || Number.isNaN(duration) || !Number.isFinite(duration)) {
        reject(new Error("영상 길이를 확인할 수 없습니다."));
        return;
      }
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("영상 정보를 불러오지 못했습니다."));
    };
    video.src = objectUrl;
  });
};

export default function ChapterForm({
  mode = "create",
  initialChapter = { id: 0, title: "", description: "", duration: "", video: null, preview: "" },
  onClose,
  onSubmit,
}: ChapterFormProps) {
  const [title, setTitle] = useState(initialChapter.title);
  const [description, setDescription] = useState(initialChapter.description);
  const [duration, setDuration] = useState(initialChapter.duration); 
  const [video, setVideo] = useState<File | null>(initialChapter.video);
  const [preview, setPreview] = useState(initialChapter.preview);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 에러 상태 추가
  const [errors, setErrors] = useState({ title: "", description: "", video: "" });
  const [globalError, setGlobalError] = useState("");

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, video: "영상 파일만 업로드할 수 있습니다." }));
      return;
    }

    setVideo(file);
    setPreview(URL.createObjectURL(file));

    try {
      const durationSeconds = await getVideoDurationSeconds(file);
      setDuration(String(durationSeconds)); 
      if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, video: "영상 길이를 자동 확인하지 못했습니다." }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    let hasError = false;
    const newErrors = { title: "", description: "", video: "" };

    if (!title.trim()) { newErrors.title = "챕터 제목을 입력해주세요."; hasError = true; }
    if (!description.trim()) { newErrors.description = "챕터 설명을 입력해주세요."; hasError = true; }
    if (!video && !preview) { newErrors.video = "강의 영상을 업로드해주세요."; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setGlobalError("");

    try {
      if (onSubmit) {
        const isSuccess = await onSubmit({ title, description, duration, video });
        if (isSuccess === false) {
          setIsSubmitting(false);
          return;
        }
      }
      setOpenCompleteModal(true);
    } catch (error: any) {
      setGlobalError(error.message || "처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 rounded-[20px] border border-[#E4E7EC] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[#111827]">
            {mode === "create" ? "새 챕터 추가" : "챕터 수정"}
          </h2>
          <p className="mt-1 text-[14px] text-[#98A2B3]">
            {mode === "create" ? "새로운 강의 챕터를 추가합니다" : "챕터 정보를 수정합니다"}
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-[22px] text-[#98A2B3] transition hover:text-[#111827]">
            ✕
          </button>
        )}
      </div>

      {globalError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          🚨 {globalError}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">챕터 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="챕터 제목 입력"
            className={`mt-2 h-[42px] w-full rounded-[10px] border px-4 text-[13px] outline-none transition-colors ${errors.title ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"}`}
            disabled={isSubmitting}
          />
          {errors.title && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.title}</p>}
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#344054]">챕터 설명</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="챕터 설명 입력"
            className={`mt-2 h-[90px] w-full resize-none rounded-[10px] border p-4 text-[13px] outline-none transition-colors ${errors.description ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E4E7EC] focus:border-[#439A97]"}`}
            disabled={isSubmitting}
          />
          {errors.description && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.description}</p>}
        </div>

        {/* 🌟 불필요한 강의 시간 (자동 계산) 입력/표시 영역 완전히 삭제됨 */}

        <div>
          <label className="text-[13px] font-semibold text-[#344054]">강의 영상</label>
          <label className={`mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed transition-colors ${errors.video ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D0D5DD] bg-[#FCFCFD]"}`}>
            {video || preview ? (
              <div className="flex flex-col items-center">
                <video src={preview} controls className="h-[65px] rounded-[8px]" />
                <p className="mt-2 text-[12px] font-medium text-[#111827]">
                  {video ? video.name : "기존 영상 유지됨"}
                </p>
              </div>
            ) : (
              <>
                <img src="/images/upload.svg" alt="업로드" className="h-[22px] w-[22px]" />
                <p className="mt-2 text-[12px] font-semibold text-[#344054]">영상 파일 업로드</p>
              </>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleVideoUpload(file);
              }}
            />
          </label>
          {errors.video && <p className="mt-1 text-[13px] text-[#DC2626]">{errors.video}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="h-[42px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          취소
        </button>
        {/* 🌟 쓸데없는 수정 확인 모달(Modal) 대신 버튼 누르면 즉시 저장! */}
        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={`flex h-[42px] items-center justify-center rounded-[12px] px-6 text-[14px] font-semibold text-white transition-colors hover:opacity-90 ${isSubmitting ? "bg-[#98A2B3] cursor-not-allowed" : "bg-[#439A97]"}`}>
          {isSubmitting ? "처리 중..." : mode === "create" ? "챕터 추가" : "챕터 수정"}
        </button>
      </div>

      <CompleteModal
        open={openCompleteModal}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={mode === "create" ? "새로운 챕터가 성공적으로 등록되었습니다." : "챕터가 성공적으로 수정되었습니다."}
        buttonText="확인"
        onConfirm={() => {
          setOpenCompleteModal(false);
          if (mode === "create") window.location.reload(); 
          else onClose?.();
        }}
      />
    </div>
  );
}