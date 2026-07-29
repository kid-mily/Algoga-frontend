"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createCommunityPost,
  getCommunityContinents,
  getCommunityCountries,
  getCommunityPost,
  getCommunityPostTags,
  updateCommunityPost,
} from "@/features/services/community.service";
import { getRequestErrorMessage } from "@/features/community/utils/communityErrors";
import { DEFAULT_COMMUNITY_FILTERS } from "@/features/community/utils/communityDefaults";
import {
  type CommunityCategoryCode,
  type CommunityFilter,
} from "@/features/community/types";
import { useCommunityImageUpload } from "./useCommunityImageUpload";
import { useCommunityLocationOptions } from "./useCommunityLocationOptions";

export const MAX_TITLE_LENGTH = 60;
export const MAX_CONTENT_LENGTH = 2000;
export const MAX_CUSTOM_TAG_COUNT = 10;
export const MAX_CUSTOM_TAG_LENGTH = 10;
export { MAX_IMAGE_COUNT } from "./useCommunityImageUpload";

export const useCommunityWriteForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPostId = Number(searchParams.get("postId"));
  const isEditMode = Number.isSafeInteger(editPostId) && editPostId > 0;

  const [tags, setTags] = useState<CommunityFilter[]>(DEFAULT_COMMUNITY_FILTERS);
  const [tagType, setTagType] = useState<CommunityCategoryCode | "">("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useCommunityLocationOptions(isEditMode, setErrorMessage);
  const imageUpload = useCommunityImageUpload();

  const isFreeTag = tagType === "FREE";
  const isFormValid = Boolean(tagType && title.trim() && content.trim());

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialOptions = async () => {
      try {
        const [continentData, tagData, postData] = await Promise.all([
          getCommunityContinents(controller.signal),
          getCommunityPostTags(controller.signal),
          isEditMode ? getCommunityPost(editPostId, controller.signal) : Promise.resolve(null),
        ]);

        location.setContinents(continentData);
        if (tagData.length > 0) {
          setTags(tagData.filter((tag) => tag.tagType !== "COUNTRY"));
        }

        if (postData) {
          setTitle(postData.title.slice(0, MAX_TITLE_LENGTH));
          setContent(postData.content.slice(0, MAX_CONTENT_LENGTH));
          setTagType(postData.categoryCode ?? "");
          imageUpload.resetForEdit(postData.imageUrls);

          if (postData.countryId) {
            // 대륙별 국가 목록을 병렬로 조회한 뒤 저장된 countryId가 속한 대륙을 찾는다
            // (기존엔 대륙마다 순차 await라 최악의 경우 대륙 수만큼 직렬 요청).
            const countriesByContinent = await Promise.all(
              continentData.map((continent) =>
                getCommunityCountries(continent.continentCode, controller.signal).then(
                  (countryData) => ({ continent, countryData })
                )
              )
            );

            for (const { continent, countryData } of countriesByContinent) {
              const matchedCountry = countryData.find(
                (country) => country.countryId === postData.countryId
              );

              if (matchedCountry) {
                location.restoreSelection(
                  continent.continentCode,
                  countryData,
                  String(matchedCountry.countryId)
                );
                break;
              }
            }
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(getRequestErrorMessage(error, "작성 옵션을 불러오지 못했습니다."));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPostId, isEditMode]);

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
        countryId: Number(location.countryId) > 0 ? Number(location.countryId) : undefined,
        tagType,
        customTags: isFreeTag ? customTags : [],
        images: imageUpload.images,
      };

      if (isEditMode) {
        await updateCommunityPost({
          postId: editPostId,
          ...payload,
          existingImageUrls: imageUpload.existingImageUrls,
          deletedImageUrls: imageUpload.deletedImageUrls,
        });
      } else {
        await createCommunityPost(payload);
      }

      setIsCompleteModalOpen(true);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "게시글 등록에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    continents: location.continents,
    countries: location.countries,
    tags,
    continentCode: location.continentCode,
    countryId: location.countryId,
    tagType,
    customTagInput,
    customTags,
    title,
    content,
    existingImageUrls: imageUpload.existingImageUrls,
    imagePreviews: imageUpload.imagePreviews,
    isEditMode,
    editPostId,
    isFreeTag,
    isFormValid,
    isInitialLoading,
    isLoadingCountries: location.isLoadingCountries,
    isSubmitting,
    isCompleteModalOpen,
    errorMessage,
    fileInputRef: imageUpload.fileInputRef,
    setContinentCode: location.setContinentCode,
    setCountryId: location.setCountryId,
    setCustomTagInput,
    setIsCompleteModalOpen,
    handleAddCustomTag,
    handleCancel: () => router.push("/community"),
    handleCompleteConfirm: () => router.push(isEditMode ? `/community/${editPostId}` : "/community"),
    handleBack: () => router.back(),
    handleContentChange: (value: string) => setContent(value.slice(0, MAX_CONTENT_LENGTH)),
    handleImageChange: imageUpload.handleImageChange,
    handleOpenFilePicker: imageUpload.handleOpenFilePicker,
    handleRemoveCustomTag,
    handleRemoveExistingImage: imageUpload.handleRemoveExistingImage,
    handleRemoveImage: imageUpload.handleRemoveImage,
    handleSubmit,
    handleTagTypeChange,
    handleTitleChange: (value: string) => setTitle(value.slice(0, MAX_TITLE_LENGTH)),
  };
};
