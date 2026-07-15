import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

export const MAX_IMAGE_COUNT = 10;

export const useCommunityImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const imagePreviews = useMemo(
    () => images.map((image) => ({ file: image, url: URL.createObjectURL(image) })),
    [images]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const remainingImageCount = Math.max(MAX_IMAGE_COUNT - existingImageUrls.length, 0);
    setImages((prev) => [...prev, ...selectedFiles].slice(0, remainingImageCount));
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImageUrls((prev) => prev.filter((url) => url !== imageUrl));
    setDeletedImageUrls((prev) => (prev.includes(imageUrl) ? prev : [...prev, imageUrl]));
  };

  // 수정 모드 초기 로드 시 기존 게시글의 이미지로 상태를 세팅
  const resetForEdit = (nextExistingImageUrls: string[]) => {
    setExistingImageUrls(nextExistingImageUrls);
    setDeletedImageUrls([]);
  };

  return {
    fileInputRef,
    images,
    existingImageUrls,
    deletedImageUrls,
    imagePreviews,
    handleImageChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    handleOpenFilePicker: () => fileInputRef.current?.click(),
    resetForEdit,
  };
};
