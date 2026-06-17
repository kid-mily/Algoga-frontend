"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const BANNER_IMAGE_WIDTH = 896;
const BANNER_IMAGE_HEIGHT = 200;

export const useBannerForm = (mode: "create" | "edit", bannerId?: number) => {
  const [formData, setFormData] = useState<BannerFormData>(initialFormData);
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const latestPreviewUrlRef = useRef("");

  const updateField = <K extends keyof BannerFormData>(
    field: K,
    value: BannerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setFileError("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedFile) {
      latestPreviewUrlRef.current = "";
      setPreviewUrl("");
      return;
    }

    const nextFileType: BannerFileType = selectedFile.type.startsWith("video/")
      ? "VIDEO"
      : "IMAGE";

    setFormData((prev) => ({ ...prev, fileType: nextFileType }));
    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    latestPreviewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);

    if (nextFileType === "IMAGE") {
      const image = new Image();
      const validationPreviewUrl = nextPreviewUrl;

      image.onload = () => {
        if (
          image.src !== validationPreviewUrl ||
          latestPreviewUrlRef.current !== validationPreviewUrl
        ) {
          return;
        }

        if (
          image.naturalWidth !== BANNER_IMAGE_WIDTH ||
          image.naturalHeight !== BANNER_IMAGE_HEIGHT
        ) {
          setFileError(
            `배너 이미지의 해상도는 ${BANNER_IMAGE_WIDTH}x${BANNER_IMAGE_HEIGHT} 이어야 합니다. (현재: ${image.naturalWidth}x${image.naturalHeight})`
          );
        }
      };

      image.onerror = () => {
        if (
          image.src !== validationPreviewUrl ||
          latestPreviewUrlRef.current !== validationPreviewUrl
        ) {
          return;
        }

        setFileError("이미지 해상도를 확인하지 못했습니다.");
      };

      image.src = nextPreviewUrl;
    }
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

    if (fileError) {
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
      const message =
        submitError instanceof Error
          ? submitError.message
          : "배너 저장에 실패했습니다.";

      if (/해상도|image|이미지/.test(message)) {
        setFileError(message);
      } else {
        setError(message);
      }
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
    fileError,
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
