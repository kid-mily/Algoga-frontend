"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Send, X } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import CommunityActionModal from "@/features/community/components/CommunityActionModal";
import {
  createCommunityPost,
  getCommunityContinents,
  getCommunityCountries,
  getCommunityPost,
  getCommunityPostTags,
  updateCommunityPost,
  type CommunityCategoryCode,
  type CommunityContinent,
  type CommunityCountry,
  type CommunityFilter,
} from "@/features/services/community.service";

const MAX_TITLE_LENGTH = 60;
const MAX_CONTENT_LENGTH = 2000;
const MAX_IMAGE_COUNT = 10;
const MAX_CUSTOM_TAG_COUNT = 10;
const MAX_CUSTOM_TAG_LENGTH = 10;

const DEFAULT_TAGS: CommunityFilter[] = [
  { id: "TRAVEL_REVIEW", tagType: "CATEGORY", tagName: "여행후기", category: "TRAVEL_REVIEW" },
  { id: "TIP_INFO", tagType: "CATEGORY", tagName: "팁&정보", category: "TIP_INFO" },
  { id: "QUESTION", tagType: "CATEGORY", tagName: "질문", category: "QUESTION" },
  { id: "COMPANION", tagType: "CATEGORY", tagName: "동행 구해요", category: "COMPANION" },
  { id: "FREE", tagType: "CATEGORY", tagName: "자유", category: "FREE" },
  { id: "LECTURE", tagType: "CATEGORY", tagName: "수강강의", category: "LECTURE" },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export default function CommunityWriteForm() {
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
  const isFormValid =
    Number(countryId) > 0 && tagType && title.trim() && content.trim();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || !tagType) {
      window.alert("필수 항목을 모두 입력해주세요.");
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

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10">
      <CommunityActionModal
        open={isCompleteModalOpen}
        title={isEditMode ? "게시글 수정 완료" : "게시글 등록 완료"}
        description={
          isEditMode
            ? "게시글이 수정되었습니다."
            : "커뮤니티에 게시글이 등록되었습니다."
        }
        confirmLabel="목록으로"
        onConfirm={() => router.push(isEditMode ? `/community/${editPostId}` : "/community")}
      />

      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-start gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-1 text-[#7A6F66] hover:text-[#5F928E]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#2F2A26]">
              {isEditMode ? "게시글 수정" : "게시글 작성"}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#7A6F66]">
              {isEditMode ? "작성한 여행 이야기를 수정하세요" : "여행 이야기를 커뮤니티에 공유하세요"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-semibold text-[#DC2626]">
            {errorMessage}
          </div>
        )}

        {isInitialLoading ? (
          <div className="rounded-[12px] border border-[#CFE0DE] bg-[#F8FAFC] px-8 py-12 text-center text-[15px] font-semibold text-[#7A6F66]">
            게시글 정보를 불러오는 중입니다.
          </div>
        ) : (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[12px] border border-[#CFE0DE] bg-[#F8FAFC] shadow-[0_10px_24px_rgba(72,52,35,0.07)]"
        >
          <section className="grid gap-4 bg-[#F8FAFC] px-7 py-6 md:grid-cols-3">
            <label className="block">
              <span className="mb-3 block text-sm font-bold text-[#5F928E]">대륙</span>
              <select
                value={continentCode}
                onChange={(event) => setContinentCode(event.target.value)}
                className="h-12 w-full rounded-[10px] border border-[#CFE0DE] bg-white px-4 text-sm font-semibold text-[#2F2A26] outline-none focus:border-[#6BA19D]"
              >
                <option value="">대륙 선택</option>
                {continents.map((continent) => (
                  <option key={continent.continentCode} value={continent.continentCode}>
                    {continent.continentName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-bold text-[#5F928E]">국가</span>
              <select
                value={countryId}
                onChange={(event) => setCountryId(event.target.value)}
                disabled={!continentCode || isLoadingCountries}
                className="h-12 w-full rounded-[10px] border border-[#CFE0DE] bg-white px-4 text-sm font-semibold text-[#2F2A26] outline-none disabled:bg-[#EEF4F4] disabled:text-[#9A8B7D] focus:border-[#6BA19D]"
              >
                <option value="">{isLoadingCountries ? "불러오는 중" : "국가 선택"}</option>
                {countries.map((country) => (
                  <option key={country.countryId} value={country.countryId}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-bold text-[#5F928E]">태그</span>
              <select
                value={tagType}
                onChange={(event) => {
                  setTagType(event.target.value as CommunityCategoryCode);
                  setCustomTags([]);
                  setCustomTagInput("");
                }}
                className="h-12 w-full rounded-[10px] border border-[#CFE0DE] bg-white px-4 text-sm font-semibold text-[#2F2A26] outline-none focus:border-[#6BA19D]"
              >
                <option value="">태그 선택</option>
                {tags.filter((tag) => tag.category).map((tag) => (
                  <option key={tag.id} value={tag.category}>
                    {tag.tagName}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="space-y-8 px-7 py-8">
            {isFreeTag && (
              <div>
                <label className="mb-3 block text-base font-bold text-[#2F2A26]">
                  커스텀 태그
                </label>
                <div className="flex gap-2">
                  <input
                    value={customTagInput}
                    onChange={(event) =>
                      setCustomTagInput(event.target.value.slice(0, MAX_CUSTOM_TAG_LENGTH))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="최대 10자"
                    className="h-12 flex-1 rounded-[10px] border border-[#CFE0DE] bg-[#F3F6F8] px-4 text-sm font-semibold text-[#2F2A26] outline-none focus:border-[#6BA19D] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    disabled={customTags.length >= MAX_CUSTOM_TAG_COUNT}
                    className="h-12 rounded-[10px] bg-[#6BA19D] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#CFE0DE]"
                  >
                    추가
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {customTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setCustomTags((prev) => prev.filter((item) => item !== tag))}
                      className="rounded-full bg-[#EEF4F4] px-3 py-1 text-xs font-bold text-[#5F928E]"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-3 block text-base font-bold text-[#2F2A26]">
                제목 <span className="text-[#DC2626]">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value.slice(0, MAX_TITLE_LENGTH))}
                placeholder="어떤 여행이었나요?"
                className="h-14 w-full rounded-[10px] border border-[#CFE0DE] bg-[#F3F6F8] px-5 text-sm font-semibold text-[#2F2A26] outline-none focus:border-[#6BA19D] focus:bg-white"
              />
              <div className="mt-2 text-right text-sm font-semibold text-[#9A8B7D]">
                {title.length}/{MAX_TITLE_LENGTH}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-base font-bold text-[#2F2A26]">
                내용 <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value.slice(0, MAX_CONTENT_LENGTH))}
                placeholder="여행 이야기를 자유롭게 나눠주세요"
                className="h-64 w-full resize-none rounded-[10px] border border-[#CFE0DE] bg-[#F3F6F8] px-5 py-5 text-sm font-semibold leading-7 text-[#2F2A26] outline-none focus:border-[#6BA19D] focus:bg-white"
              />
              <div className="mt-2 text-right text-sm font-semibold text-[#9A8B7D]">
                {content.length}/{MAX_CONTENT_LENGTH}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-base font-bold text-[#2F2A26]">
                사진 첨부 <span className="text-sm font-medium text-[#9A8B7D]">최대 10장</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={existingImageUrls.length + images.length >= MAX_IMAGE_COUNT}
                className="flex h-36 w-full flex-col items-center justify-center rounded-[10px] border border-dashed border-[#6BA19D] bg-[#EEF4F4] text-center transition hover:bg-[#E4F0EF] disabled:cursor-not-allowed disabled:border-[#CFE0DE] disabled:opacity-60"
              >
                <ImagePlus className="text-[#5F928E]" size={32} />
                <span className="mt-3 text-sm font-bold text-[#5F928E]">사진 선택</span>
              </button>

              {(existingImageUrls.length > 0 || imagePreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {existingImageUrls.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      className="relative h-24 overflow-hidden rounded-[10px] border border-[#CFE0DE] bg-[#EEF4F4]"
                    >
                      <Image
                        src={imageUrl}
                        alt={`기존 첨부 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
                        aria-label="기존 첨부 이미지 삭제"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {imagePreviews.map((preview, index) => (
                    <div
                      key={`${preview.file.name}-${index}`}
                      className="relative h-24 overflow-hidden rounded-[10px] border border-[#CFE0DE] bg-[#EEF4F4]"
                    >
                      <Image
                        src={preview.url}
                        alt={`첨부 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
                        aria-label="첨부 이미지 삭제"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/community")}
                className="h-14 rounded-[10px] border border-[#CFE0DE] bg-white text-base font-bold text-[#7A6F66] transition hover:bg-[#F3F6F8]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[#6BA19D] text-base font-bold text-white transition hover:bg-[#5F928E] disabled:cursor-not-allowed disabled:bg-[#CFE0DE]"
              >
                <Send size={18} />
                {isSubmitting ? "저장 중" : isEditMode ? "수정 완료" : "작성 완료"}
              </button>
            </div>
          </section>
        </form>
        )}
      </div>
    </main>
  );
}
