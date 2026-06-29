import { FormEvent, useRef, useState } from "react";
import type { ChapterFormErrors, ChapterFormModalType, ChapterFormProps, ChapterFormState } from "../types";

const emptyErrors: ChapterFormErrors = {
  title: "",
  description: "",
  video: "",
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

export const useChapterForm = ({
  initialChapter,
  onSubmit,
}: Pick<Required<ChapterFormProps>, "initialChapter"> &
  Pick<ChapterFormProps, "onSubmit">) => {
  const [form, setForm] = useState<ChapterFormState>({
    title: initialChapter.title,
    description: initialChapter.description,
    duration: initialChapter.duration,
    video: initialChapter.video,
    preview: initialChapter.preview,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [modalType, setModalType] = useState<ChapterFormModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ChapterFormErrors>(emptyErrors);
  const [submitError, setSubmitError] = useState("");

  const hasVideo = Boolean(form.video || form.preview);

  const updateForm = <Key extends keyof ChapterFormState>(
    key: Key,
    value: ChapterFormState[Key]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const clearFieldError = (field: keyof ChapterFormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: "" };
    });
  };

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, video: "영상 파일만 업로드할 수 있습니다." }));
      return;
    }

    if (form.preview.startsWith("blob:")) {
      URL.revokeObjectURL(form.preview);
    }

    const nextPreview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, video: file, preview: nextPreview }));

    try {
      const durationSeconds = await getVideoDurationSeconds(file);
      setForm((prev) => ({ ...prev, duration: String(durationSeconds) }));
      clearFieldError("video");
    } catch {
      setErrors((prev) => ({ ...prev, video: "영상 길이를 확인할 수 없습니다." }));
    }
  };

  const handleVideoRemove = () => {
    if (form.preview.startsWith("blob:")) {
      URL.revokeObjectURL(form.preview);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setForm((prev) => ({ ...prev, video: null, preview: "", duration: "" }));
    clearFieldError("video");
  };

  const validateForm = () => {
    const newErrors: ChapterFormErrors = { ...emptyErrors };

    if (!form.title.trim()) {
      newErrors.title = "챕터 제목을 입력해주세요.";
    }
    if (!form.description.trim()) {
      newErrors.description = "챕터 설명을 입력해주세요.";
    }
    if (!form.video && !form.preview) {
      newErrors.video = "강의 영상을 업로드해주세요.";
    }

    setErrors(newErrors);

    return !newErrors.title && !newErrors.description && !newErrors.video;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (onSubmit) {
        const isSuccess = await onSubmit({
          title: form.title,
          description: form.description,
          duration: form.duration,
          video: form.video,
        });
        if (isSuccess === false) return;
      }
      setModalType("complete");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "챕터 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    fileInputRef,
    form,
    hasVideo,
    isSubmitting,
    modalType,
    submitError,
    clearFieldError,
    handleSubmit,
    handleVideoRemove,
    handleVideoUpload,
    setModalType,
    updateForm,
  };
};
