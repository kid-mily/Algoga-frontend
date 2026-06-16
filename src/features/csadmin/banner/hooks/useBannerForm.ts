"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminBannerById,
  modifyAdminBanner,
  registerAdminBanner,
} from "@/features/services/adminBanner.service";
import { BannerFileType, BannerFormData } from "../types";

const initialFormData: BannerFormData = {
  text: "",
  linkUrl: "",
  fileType: "IMAGE",
  isVisible: true,
};

export const useBannerForm = (mode: "create" | "edit", bannerId?: number) => {
  const [formData, setFormData] = useState<BannerFormData>(initialFormData);
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const updateField = <K extends keyof BannerFormData>(
    field: K,
    value: BannerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const nextFileType: BannerFileType = selectedFile.type.startsWith("video/")
      ? "VIDEO"
      : "IMAGE";

    setFormData((prev) => ({ ...prev, fileType: nextFileType }));
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const validateForm = () => {
    if (!formData.text.trim()) {
      setError("배너 문구를 입력해주세요.");
      return false;
    }

    if (!formData.linkUrl.trim()) {
      setError("연결 URL을 입력해주세요.");
      return false;
    }

    if (mode === "create" && !file) {
      setError("배너 이미지 또는 영상을 선택해주세요.");
      return false;
    }

    setError("");
    return true;
  };

  const fetchBanner = useCallback(async (signal?: AbortSignal) => {
    await Promise.resolve();

    if (mode !== "edit" || !bannerId) return;

    try {
      setIsLoading(true);
      setError("");
      const banner = await getAdminBannerById(bannerId, signal);

      if (signal?.aborted) return;

      if (!banner) {
        setError("배너 정보를 찾을 수 없습니다.");
        return;
      }

      setFormData({
        text: banner.text,
        linkUrl: banner.linkUrl,
        fileType: banner.fileType,
        isVisible: banner.isVisible,
      });
      setCurrentMediaUrl(banner.imageUrl);
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "배너 정보를 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [bannerId, mode]);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await fetchBanner(controller.signal);
    })();

    return () => {
      controller.abort();
    };
  }, [fetchBanner]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const saveBanner = async () => {
    if (isSubmitting || !validateForm()) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "create") {
        await registerAdminBanner(formData, file);
      } else if (bannerId) {
        await modifyAdminBanner(bannerId, formData, file);
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "배너 저장에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mediaPreviewUrl = useMemo(
    () => previewUrl || currentMediaUrl,
    [currentMediaUrl, previewUrl]
  );

  return {
    formData,
    file,
    mediaPreviewUrl,
    isLoading,
    isSubmitting,
    error,
    confirmOpen,
    completeOpen,
    setConfirmOpen,
    setCompleteOpen,
    updateField,
    handleFileChange,
    validateForm,
    saveBanner,
  };
};
