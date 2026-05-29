"use client";

import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

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

// 🌟 1. 시간 포맷 함수 (초 -> 분/초 변환)
const formatDuration = (durationSeconds: number) => {
  if (!durationSeconds || durationSeconds <= 0) {
    return "";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);

  if (minutes <= 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
};

// 🌟 2. 영상 파일에서 길이를 자동 추출하는 함수
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
  const [title, setTitle] = useState(initialChapter.title);
  const [description, setDescription] = useState(initialChapter.description);
  const [duration, setDuration] = useState(initialChapter.duration); // 초 단위 저장
  const [video, setVideo] = useState<File | null>(initialChapter.video);
  const [preview, setPreview] = useState(initialChapter.preview);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 3. 업로드 시 길이를 추출하여 자동 입력하도록 수정
  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("영상 파일만 업로드할 수 있습니다.");
      return;
    }

    setVideo(file);
    setPreview(URL.createObjectURL(file));

    try {
      const durationSeconds = await getVideoDurationSeconds(file);
      setDuration(String(durationSeconds)); // 추출한 길이를 자동으로 state에 저장
    } catch (error: any) {
      alert(error.message || "영상 길이를 자동 확인하지 못했습니다.");
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (mode === "create") {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          const isSuccess = await onSubmit({ title, description, duration, video });
          
          if (isSuccess === false) {
            setIsSubmitting(false);
            return;
          }
        }
        setOpenCompleteModal(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setOpenEditModal(true);
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
            {mode === "create"
              ? "새로운 강의 챕터를 추가합니다"
              : "챕터 정보를 수정합니다"}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] text-[#98A2B3] transition hover:text-[#111827]"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            챕터 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="챕터 제목 입력"
            className="mt-2 h-[42px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[13px] outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            챕터 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="챕터 설명 입력"
            className="mt-2 h-[90px] w-full resize-none rounded-[10px] border border-[#E4E7EC] p-4 text-[13px] outline-none"
            disabled={isSubmitting}
          />
        </div>

        {/* 🌟 4. 수동 입력 칸을 지우고 자동 계산된 결과만 보여줌 */}
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            강의 시간 (자동 계산)
          </label>
          <div
            className={`mt-2 flex h-[42px] w-full items-center rounded-[10px] border border-[#E4E7EC] px-4 text-[13px] ${
              duration ? "bg-white text-[#111827]" : "bg-[#F9FAFB] text-[#98A2B3]"
            }`}
          >
            {duration ? `${formatDuration(Number(duration))} (${duration}초)` : "영상을 업로드하면 자동으로 계산됩니다."}
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            강의 영상
          </label>
          <label className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
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
                <p className="mt-2 text-[12px] font-semibold text-[#344054]">
                  영상 파일 업로드
                </p>
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
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-[42px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex h-[42px] items-center justify-center rounded-[12px] px-6 text-[14px] font-semibold text-white transition-colors ${
            isSubmitting ? "bg-[#98A2B3] cursor-not-allowed" : "bg-[#439A97]"
          }`}
        >
          {isSubmitting
            ? "처리 중..." 
            : mode === "create" ? "챕터 추가" : "챕터 수정"}
        </button>
      </div>

      <CompleteModal
        open={openCompleteModal}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "새로운 챕터가 성공적으로 등록되었습니다."
            : "챕터가 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => {
          setOpenCompleteModal(false);
          if (mode === "create") {
            window.location.reload(); 
          } else {
            onClose?.();
          }
        }}
      />

      <Modal
        open={openEditModal}
        title="챕터 수정"
        description="챕터를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={async () => {
          if (isSubmitting) return;

          setIsSubmitting(true);
          try {
            if (onSubmit) {
              const isSuccess = await onSubmit({ title, description, duration, video });
              if (isSuccess === false) return;
            }
            setOpenEditModal(false);
            setOpenCompleteModal(true);
          } finally {
            setIsSubmitting(false);
          }
        }}
        onCancel={() => setOpenEditModal(false)}
      />
    </div>
  );
}