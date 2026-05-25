"use client";

import { useState } from "react";

import ChapterItem from "./ChapterItem";

interface Chapter {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;
}

interface ChapterFormProps {
  onPrev?: () => void;
  onSubmit?: (chapters: Chapter[]) => void;
}

export default function ChapterForm({
  onPrev,
  onSubmit,
}: ChapterFormProps) {

  // 챕터 리스트
  const [chapters, setChapters] =
    useState<Chapter[]>([
      {
        id: 1,
        title: "",
        description: "",
        video: null,
        preview: "",
      },
    ]);

  // 챕터 추가
  const handleAddChapter = () => {

    setChapters((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "",
        description: "",
        video: null,
        preview: "",
      },
    ]);
  };

  // 챕터 삭제
  const handleRemoveChapter = (
    id: number
  ) => {

    if (chapters.length === 1) {

      alert(
        "최소 1개의 챕터가 필요합니다"
      );

      return;
    }

    setChapters((prev) =>
      prev.filter(
        (chapter) =>
          chapter.id !== id
      )
    );
  };

  // input 변경
  const handleChange = (
    id: number,
    field: "title" | "description",
    value: string
  ) => {

    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === id
          ? {
              ...chapter,
              [field]: value,
            }
          : chapter
      )
    );
  };

  // 영상 업로드
  const handleVideoUpload = (
    id: number,
    file: File
  ) => {

    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === id
          ? {
              ...chapter,
              video: file,
              preview:
                URL.createObjectURL(file),
            }
          : chapter
      )
    );
  };

  // 등록
  const handleSubmit = () => {

    for (const chapter of chapters) {

      if (!chapter.title) {

        alert(
          `${chapter.id}번 챕터 제목을 입력해주세요`
        );

        return;
      }

      if (!chapter.description) {

        alert(
          `${chapter.id}번 챭터 설명을 입력해주세요`
        );

        return;
      }

      if (!chapter.video) {

        alert(
          `${chapter.id}번 챕터 영상을 업로드해주세요`
        );

        return;
      }
    }

    onSubmit?.(chapters);

    console.log(chapters);
  };

  return (
    <div className="rounded-[16px] border border-[#E4E7EC] bg-white p-4">

      {/* 상단 */}
      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-[18px] font-bold text-[#111827]">
            챕터 구성
          </h2>

          <p className="mt-1 text-[12px] text-[#98A2B3]">
            강의 내용을 챕터로 나누어 구성합니다
          </p>
        </div>

        {/* 챕터 추가 */}
        <button
          type="button"
          onClick={handleAddChapter}
          className="flex h-[38px] items-center rounded-[10px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
        >
          + 챕터 추가
        </button>
      </div>

      {/* 챕터 리스트 */}
      <div className="mt-5 space-y-4">

        {chapters.map((chapter) => (

          <ChapterItem
            key={chapter.id}
            id={chapter.id}
            title={chapter.title}
            description={chapter.description}
            video={chapter.video}
            preview={chapter.preview}

            onRemove={() =>
              handleRemoveChapter(
                chapter.id
              )
            }

            onTitleChange={(value) =>
              handleChange(
                chapter.id,
                "title",
                value
              )
            }

            onDescriptionChange={(value) =>
              handleChange(
                chapter.id,
                "description",
                value
              )
            }

            onVideoUpload={(file) =>
              handleVideoUpload(
                chapter.id,
                file
              )
            }
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E4E7EC] pt-5">

        {/* 이전 */}
        <button
          type="button"
          onClick={onPrev}
          className="h-[38px] rounded-[10px] border border-[#E4E7EC] px-5 text-[13px] font-semibold text-[#667085]"
        >
          이전
        </button>

        {/* 등록 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="h-[38px] rounded-[10px] bg-[#439A97] px-5 text-[13px] font-semibold text-white"
        >
          등록 완료
        </button>
      </div>
    </div>
  );
}