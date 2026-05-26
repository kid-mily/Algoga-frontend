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

interface LectureChapterFormProps {
  onPrev: () => void;

  onSubmit: (
    chapters: Chapter[]
  ) => void;
}

export default function LectureChapterForm({
  onPrev,
  onSubmit,
}: LectureChapterFormProps) {

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

    setChapters((prev) =>
      prev.filter(
        (chapter) =>
          chapter.id !== id
      )
    );
  };

  // 제목 변경
  const handleTitleChange = (
    id: number,
    value: string
  ) => {

    setChapters((prev) =>
      prev.map((chapter) =>

        chapter.id === id

          ? {
              ...chapter,
              title: value,
            }

          : chapter
      )
    );
  };

  // 설명 변경
  const handleDescriptionChange = (
    id: number,
    value: string
  ) => {

    setChapters((prev) =>
      prev.map((chapter) =>

        chapter.id === id

          ? {
              ...chapter,
              description: value,
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
                URL.createObjectURL(
                  file
                ),
            }

          : chapter
      )
    );
  };

  return (
    <div className="rounded-[20px] border border-[#E4E7EC] bg-white p-6">

      {/* 상단 */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-[24px] font-bold text-[#111827]">
            챕터 상세 정보
          </h2>

          <p className="mt-1 text-[15px] text-[#98A2B3]">
            강의 챕터를 구성합니다
          </p>
        </div>

        {/* 추가 버튼 */}
        <button
          type="button"
          onClick={handleAddChapter}
          className="h-[44px] rounded-full bg-[#439A97] px-5 text-[14px] font-semibold text-white"
        >
          + 챕터 추가
        </button>
      </div>

      {/* 리스트 */}
      <div className="mt-6 space-y-4">

        {chapters.map((chapter) => (

          <ChapterItem
            key={chapter.id}

            id={chapter.id}

            title={chapter.title}

            description={
              chapter.description
            }

            video={chapter.video}

            preview={chapter.preview}

            onRemove={() =>
              handleRemoveChapter(
                chapter.id
              )
            }

            onTitleChange={(value) =>
              handleTitleChange(
                chapter.id,
                value
              )
            }

            onDescriptionChange={(value) =>
              handleDescriptionChange(
                chapter.id,
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

      {/* 버튼 */}
      <div className="mt-8 flex justify-between">

        {/* 이전 */}
        <button
          type="button"
          onClick={onPrev}
          className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-6 text-[15px] font-semibold text-[#667085]"
        >
          이전
        </button>

        {/* 완료 */}
        <button
          type="button"
          onClick={() =>
            onSubmit(chapters)
          }
          className="h-[48px] rounded-[14px] bg-[#439A97] px-6 text-[15px] font-semibold text-white"
        >
          강의 등록 완료
        </button>
      </div>
    </div>
  );
}