"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminNoticeById,
  getNoticeTags,
  modifyAdminNotice,
  registerAdminNotice,
} from "@/features/services/adminNotice.service";
import {
  emptyNoticeForm,
  NoticeFormData,
  NoticeTagOption,
  noticeTagOptions,
  toNoticeFormData,
} from "../utils";

type NoticeFormMode = "create" | "edit";

export const useNoticeForm = (mode: NoticeFormMode, noticeId?: number) => {
  const [formData, setFormData] = useState<NoticeFormData>(emptyNoticeForm);
  const [tagOptions, setTagOptions] = useState<NoticeTagOption[]>(noticeTagOptions);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);


  const fetchTags = useCallback(async (signal?: AbortSignal) => {
    try {
      const tags = await getNoticeTags(signal);

      if (signal?.aborted) return;

      setTagOptions(tags);
      setFormData((prev) => {
        if (tags.some((tag) => tag.value === prev.tag)) return prev;

        return {
          ...prev,
          tag: tags[0]?.value ?? prev.tag,
        };
      });
    } catch {
      if (!signal?.aborted) {
        setTagOptions(noticeTagOptions);
      }
    }
  }, []);

  const fetchNotice = useCallback(async (signal?: AbortSignal) => {
    if (mode !== "edit" || !noticeId) return;

    try {
      setIsLoading(true);
      setError("");
      const notice = await getAdminNoticeById(noticeId, signal);

      if (signal?.aborted) return;

      if (!notice) {
        setError("공지사항을 찾을 수 없습니다.");
        return;
      }

      setFormData(toNoticeFormData(notice));
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "공지사항 정보를 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [mode, noticeId]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchTags(controller.signal);
      void fetchNotice(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchNotice, fetchTags]);

  const displayedTagOptions = useMemo(() => {
    if (!formData.tag || tagOptions.some((tag) => tag.value === formData.tag)) {
      return tagOptions;
    }

    return [
      ...tagOptions,
      {
        value: formData.tag,
        label: formData.tag,
      },
    ];
  }, [formData.tag, tagOptions]);

  const updateField = <K extends keyof NoticeFormData>(
    key: K,
    value: NoticeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("공지사항 제목을 입력해주세요.");
      return false;
    }

    if (!formData.content.trim()) {
      setError("공지사항 내용을 입력해주세요.");
      return false;
    }

    if (!formData.tag) {
      setError("공지사항 태그를 선택해주세요.");
      return false;
    }

    setError("");
    return true;
  };

  const saveNotice = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "edit" && noticeId) {
        await modifyAdminNotice(noticeId, formData);
      } else {
        await registerAdminNotice(formData);
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "공지사항 저장에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    tagOptions: displayedTagOptions,
    isLoading,
    isSubmitting,
    error,
    confirmOpen,
    completeOpen,
    setConfirmOpen,
    setCompleteOpen,
    updateField,
    saveNotice,
    validateForm,
  };
};
