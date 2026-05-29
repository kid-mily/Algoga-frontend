// src/features/contentmanage/LectureChapterForm.tsx

"use client";

import { useState } from "react";
import ChapterItem from "./ChapterItem";
import { createAdminChapter } from "@/features/services/adminChapter.service";

interface Chapter {
  id: number;
  title: string;
  description: string;
  video: File | null;
  preview: string;
  durationSeconds: number;
}

interface LectureChapterFormProps {
  courseId: number;
  onPrev: () => void;
  onSubmit: () => void;
}

const formatDuration = (durationSeconds: number) => {
  if (!durationSeconds || durationSeconds <= 0) {
    return "";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);

  if (minutes <= 0) {
    return `${seconds}초`;
  }

  if (seconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${seconds}초`;
};

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

export default function LectureChapterForm({
  courseId,
  onPrev,
  onSubmit,
}: LectureChapterFormProps) {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "",
      description: "",
      video: null,
      preview: "",
      durationSeconds: 0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddChapter = () => {
    if (chapters.length >= 5) {
      alert("챕터는 최대 5개까지 등록할 수 있습니다.");
      return;
    }

    setChapters((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "",
        description: "",
        video: null,
        preview: "",
        durationSeconds: 0,
      },
    ]);
  };

  const handleRemoveChapter = (id: number) => {
    setChapters((prev) =>
      prev
        .filter((chapter) => chapter.id !== id)
        .map((chapter, index) => ({
          ...chapter,
          id: index + 1,
        }))
    );
  };

  const handleTitleChange = (id: number, value: string) => {
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

  const handleDescriptionChange = (id: number, value: string) => {
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

  const handleVideoUpload = async (id: number, file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("영상 파일만 업로드할 수 있습니다.");
      return;
    }

    const preview = URL.createObjectURL(file);

    try {
      const durationSeconds = await getVideoDurationSeconds(file);

      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.id === id
            ? {
                ...chapter,
                video: file,
                preview,
                durationSeconds,
              }
            : chapter
        )
      );
    } catch (error: any) {
      URL.revokeObjectURL(preview);
      alert(error.message || "영상 길이를 확인하지 못했습니다.");
    }
  };

  const validateChapters = () => {
    if (!courseId) {
      alert("강의 ID를 찾을 수 없습니다. 강의 기본 정보를 먼저 등록해주세요.");
      return false;
    }

    for (const chapter of chapters) {
      if (!chapter.title.trim()) {
        alert(`Chapter ${chapter.id} 제목을 입력해주세요.`);
        return false;
      }

      if (!chapter.description.trim()) {
        alert(`Chapter ${chapter.id} 설명을 입력해주세요.`);
        return false;
      }

      if (!chapter.video) {
        alert(`Chapter ${chapter.id} 영상을 업로드해주세요.`);
        return false;
      }

      if (chapter.durationSeconds < 60) {
        alert(
          `Chapter ${chapter.id} 영상은 1분 이상이어야 합니다. 현재 영상 길이: ${
            formatDuration(chapter.durationSeconds) || "확인 불가"
          }`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateChapters()) {
      return;
    }

    try {
      setIsSubmitting(true);

      for (const [index, chapter] of chapters.entries()) {
        if (!chapter.video) {
          continue;
        }

        await createAdminChapter({
          courseId: courseId, // 👈 추가된 부분
          title: chapter.title,
          description: chapter.description, // 👈 추가된 부분
          durationSeconds: chapter.durationSeconds,
          chapterOrder: index + 1,
          video: chapter.video,
        });
      }

      onSubmit();
    } catch (error: any) {
      alert(error.message || "챕터 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[20px] border border-[#E4E7EC] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[#111827]">
            챕터 상세 정보
          </h2>

          <p className="mt-1 text-[15px] text-[#98A2B3]">
            강의 챕터를 구성합니다
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddChapter}
          disabled={isSubmitting}
          className="h-[44px] rounded-full bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          + 챕터 추가
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id}>
            <ChapterItem
              id={chapter.id}
              title={chapter.title}
              description={chapter.description}
              video={chapter.video}
              preview={chapter.preview}
              onRemove={() => handleRemoveChapter(chapter.id)}
              onTitleChange={(value) => handleTitleChange(chapter.id, value)}
              onDescriptionChange={(value) =>
                handleDescriptionChange(chapter.id, value)
              }
              onVideoUpload={(file) => handleVideoUpload(chapter.id, file)}
            />

            {chapter.video && (
              <p className="mt-2 text-[13px] font-medium text-[#439A97]">
                영상 길이: {formatDuration(chapter.durationSeconds)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-6 text-[15px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-60"
        >
          이전
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-[48px] rounded-[14px] bg-[#439A97] px-6 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "챕터 등록 중..." : "강의 등록 완료"}
        </button>
      </div>
    </div>
  );
}