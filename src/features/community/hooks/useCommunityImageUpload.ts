import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

export const MAX_IMAGE_COUNT = 10;

type ImagePreview = { file: File; url: string };

export const useCommunityImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const images = useMemo(
    () => imagePreviews.map((preview) => preview.file),
    [imagePreviews]
  );

  // 언마운트 시 남아있는 object URL을 정리 (최신 목록은 ref로 참조).
  const previewsRef = useRef(imagePreviews);
  useEffect(() => {
    previewsRef.current = imagePreviews;
  }, [imagePreviews]);
  useEffect(
    () => () =>
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url)),
    []
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selectedFiles.length === 0) return;

    const remainingImageCount = Math.max(
      MAX_IMAGE_COUNT - existingImageUrls.length,
      0
    );
    const room = Math.max(remainingImageCount - imagePreviews.length, 0);
    if (room === 0) return;

    // 새로 추가되는 파일만 object URL을 만든다(기존 프리뷰 URL은 그대로 유지 → 깜빡임 방지).
    const added = selectedFiles
      .slice(0, room)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));

    setImagePreviews((prev) => [...prev, ...added]);
  };

  const handleRemoveImage = (index: number) => {
    const target = imagePreviews[index];
    if (target) URL.revokeObjectURL(target.url);
    setImagePreviews((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
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
