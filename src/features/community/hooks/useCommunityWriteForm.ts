"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import {
  createCommunityPost,
  getCommunityContinents,
  getCommunityCountries,
  getCommunityPost,
  getCommunityPostTags,
  updateCommunityPost,
} from "@/features/services/community.service";
import {
  COMMUNITY_CATEGORIES,
  type CommunityCategoryCode,
  type CommunityContinent,
  type CommunityCountry,
  type CommunityFilter,
} from "@/features/community/types";

export const MAX_TITLE_LENGTH = 60;
export const MAX_CONTENT_LENGTH = 2000;
export const MAX_IMAGE_COUNT = 10;
export const MAX_CUSTOM_TAG_COUNT = 10;
export const MAX_CUSTOM_TAG_LENGTH = 10;

const DEFAULT_TAGS: CommunityFilter[] = COMMUNITY_CATEGORIES.map((category) => ({
  id: category.id,
  tagType: "CATEGORY",
  tagName: category.label,
  category: category.id,
}));

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const useCommunityWriteForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editPostId = Number(searchParams.get("postId"));
  const isEditMode = Number.isSafeInteger(editPostId) && editPostId > 0;

  const [continents, setContinents] = useState<CommunityContinent[]>([]);
  const [countries, setCountries] = useState<CommunityCountry[]>([]);
  const [tags, setTags] = useState<CommunityFilter[]>(DEFAULT_TAGS);
  const [continentCode, setContinentCode] = useState("");
  const [countryId, setCountryId] = useState("");
  const [tagType, setTagType] = useState<CommunityCategoryCode | "">("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const imagePreviews = useMemo(
    () => images.map((image) => ({ file: image, url: URL.createObjectURL(image) })),
    [images]
  );
  const isFreeTag = tagType === "FREE";
  const isFormValid = Boolean(
    Number(countryId) > 0 && tagType && title.trim() && content.trim()
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialOptions = async () => {
      try {
        const [continentData, tagData, postData] = await Promise.all([
          getCommunityContinents(controller.signal),
          getCommunityPostTags(controller.signal),
          isEditMode ? getCommunityPost(editPostId, controller.signal) : Promise.resolve(null),
        ]);

        setContinents(continentData);
        if (tagData.length > 0) {
          setTags(tagData.filter((tag) => tag.tagType !== "COUNTRY"));
        }

        if (postData) {
          setTitle(postData.title.slice(0, MAX_TITLE_LENGTH));
          setContent(postData.content.slice(0, MAX_CONTENT_LENGTH));
          setTagType(postData.categoryCode ?? "");
          setExistingImageUrls(postData.imageUrls);
          setDeletedImageUrls([]);

          if (postData.countryId) {
            for (const continent of continentData) {
              const countryData = await getCommunityCountries(
                continent.continentCode,
                controller.signal
              );
              const matchedCountry = countryData.find(
                (country) => country.countryId === postData.countryId
              );

              if (matchedCountry) {
                setContinentCode(continent.continentCode);
                setCountries(countryData);
                setCountryId(String(matchedCountry.countryId));
                break;
              }
            }
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error, "작성 옵션을 불러오지 못했습니다."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsInitialLoading(false);
        }
      }
    };

    void loadInitialOptions();

    return () => {
      controller.abort();
    };
  }, [editPostId, isEditMode]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!continentCode) {
      setCountries([]);
      setCountryId("");
      return;
    }

    const controller = new AbortController();

    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        if (!isEditMode) {
          setCountryId("");
        }
        const data = await getCommunityCountries(continentCode, controller.signal);
        setCountries(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error, "국가 목록을 불러오지 못했습니다."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    };

    void loadCountries();

    return () => {
      controller.abort();
    };
  }, [continentCode, isEditMode]);

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

  const handleAddCustomTag = () => {
    const nextTag = customTagInput.trim().slice(0, MAX_CUSTOM_TAG_LENGTH);
    if (!nextTag || customTags.includes(nextTag) || customTags.length >= MAX_CUSTOM_TAG_COUNT) {
      setCustomTagInput("");
      return;
    }

    setCustomTags((prev) => [...prev, nextTag]);
    setCustomTagInput("");
  };

  const handleRemoveCustomTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleTagTypeChange = (value: string) => {
    setTagType(value as CommunityCategoryCode);
    setCustomTags([]);
    setCustomTagInput("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || !tagType) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        title: title.trim(),
        content: content.trim(),
        countryId: Number(countryId),
        tagType,
        customTags: isFreeTag ? customTags : [],
        images,
      };

      if (isEditMode) {
        await updateCommunityPost({
          postId: editPostId,
          ...payload,
          existingImageUrls,
          deletedImageUrls,
        });
      } else {
        await createCommunityPost(payload);
      }

      setIsCompleteModalOpen(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "게시글 등록에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    continents,
    countries,
    tags,
    continentCode,
    countryId,
    tagType,
    customTagInput,
    customTags,
    title,
    content,
    existingImageUrls,
    imagePreviews,
    isEditMode,
    editPostId,
    isFreeTag,
    isFormValid,
    isInitialLoading,
    isLoadingCountries,
    isSubmitting,
    isCompleteModalOpen,
    errorMessage,
    fileInputRef,
    setContinentCode,
    setCountryId,
    setCustomTagInput,
    setIsCompleteModalOpen,
    handleAddCustomTag,
    handleCancel: () => router.push("/community"),
    handleCompleteConfirm: () => router.push(isEditMode ? `/community/${editPostId}` : "/community"),
    handleBack: () => router.back(),
    handleContentChange: (value: string) => setContent(value.slice(0, MAX_CONTENT_LENGTH)),
    handleImageChange,
    handleOpenFilePicker: () => fileInputRef.current?.click(),
    handleRemoveCustomTag,
    handleRemoveExistingImage,
    handleRemoveImage,
    handleSubmit,
    handleTagTypeChange,
    handleTitleChange: (value: string) => setTitle(value.slice(0, MAX_TITLE_LENGTH)),
  };
};
