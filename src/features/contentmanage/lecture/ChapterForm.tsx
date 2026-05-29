"use client";

import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

type ChapterFormMode =
  | "create"
  | "edit";

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
}

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
}: ChapterFormProps) {

  const [title, setTitle] =useState(initialChapter.title);
  const [description, setDescription] =useState(initialChapter.description);
  const [duration, setDuration] =useState(initialChapter.duration);
  const [video, setVideo] =useState<File | null>(initialChapter.video);
  const [preview, setPreview] =useState(initialChapter.preview);
  const [openCompleteModal, setOpenCompleteModal,] = useState(false);
  const [openEditModal,setOpenEditModal,] = useState(false);

  // 영상 업로드
  const handleVideoUpload = (
    file: File
  ) => {
    setVideo(file);
    setPreview(
      URL.createObjectURL(file)
    );
  };

  // 제출
  const handleSubmit = () => {

    const payload = {
      title,
      description,
      duration,
      video,
    };

    console.log(payload);

    if (mode === "create") {
    console.log("챕터 생성");
    setOpenCompleteModal(true);
  } else {
    setOpenEditModal(true);
  }
  }
  return (
    <div className="mt-8 rounded-[20px] border border-[#E4E7EC] bg-white p-5">
      {/* 상단 */}
      <div className="flex items-start justify-between">
        {/* 왼쪽 */}
        <div>
          <h2 className="text-[22px] font-bold text-[#111827]">
            {mode === "create"
              ? "새 챕터 추가"
              : "챕터 수정"}
          </h2>
          <p className="mt-1 text-[14px] text-[#98A2B3]">
            {mode === "create"
              ? "새로운 강의 챕터를 추가합니다"
              : "챕터 정보를 수정합니다"}
          </p>
        </div>

        {/* 닫기 */}
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

      {/* 입력 */}
      <div className="mt-6 space-y-4">
        {/* 제목 */}
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            챕터 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="챕터 제목 입력"
            className="mt-2 h-[42px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[13px] outline-none"
          />
        </div>

        {/* 설명 */}
        <div>

          <label className="text-[13px] font-semibold text-[#344054]">
            챕터 설명
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="챕터 설명 입력"
            className="mt-2 h-[90px] w-full resize-none rounded-[10px] border border-[#E4E7EC] p-4 text-[13px] outline-none"
          />
        </div>

        {/* 영상 길이 */}
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            강의 시간
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) =>
              setDuration(
                e.target.value
              )
            }
            placeholder="예: 15분"
            className="mt-2 h-[42px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[13px] outline-none"
          />
        </div>

        {/* 업로드 */}
        <div>
          <label className="text-[13px] font-semibold text-[#344054]">
            강의 영상
          </label>
          <label className="mt-2 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD]">
            {video ? (
              <div className="flex flex-col items-center">
                <video
                  src={preview}
                  controls
                  className="h-[65px] rounded-[8px]"
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
                  className="h-[22px] w-[22px]"
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
                handleVideoUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-6 flex justify-end gap-3">

        {/* 취소 */}
        <button
          type="button"
          onClick={onClose}
          className="h-[42px] rounded-[12px] border border-[#E4E7EC] px-6 text-[14px] font-semibold text-[#667085]"
        >
          취소
        </button>

        {/* 저장 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="h-[42px] rounded-[12px] bg-[#439A97] px-6 text-[14px] font-semibold text-white"
        >
          {mode === "create"
            ? "챕터 추가"
            : "챕터 수정"}
        </button>
      </div>
      {/* 완료 모달 */}
      <CompleteModal
        open={openCompleteModal}

        title={
          mode === "create"
            ? "등록 완료"
            : "수정 완료"
        }

        description={
          mode === "create"
            ? "챕터가 등록되었습니다."
            : "챕터가 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => {
          setOpenCompleteModal(false);
          onClose?.();
        }}
      />
      {/* 수정 확인 모달 */}
      <Modal
        open={openEditModal}
        title="챕터 수정"
        description="챕터를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          console.log("챕터 수정");
          setOpenEditModal(false);
          setOpenCompleteModal(true);
        }}
        onCancel={() =>
          setOpenEditModal(false)
        }
      />
    </div>
  );
}