"use client";

import Image from "next/image";
import { ArrowLeft, ImagePlus, Send, X } from "lucide-react";
import CommunityActionModal from "@/features/community/components/CommunityActionModal";
import {
  MAX_CONTENT_LENGTH,
  MAX_CUSTOM_TAG_COUNT,
  MAX_CUSTOM_TAG_LENGTH,
  MAX_IMAGE_COUNT,
  MAX_TITLE_LENGTH,
  useCommunityWriteForm,
} from "@/features/community/hooks/useCommunityWriteForm";

export default function CommunityWriteForm() {
  const {
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
    handleAddCustomTag,
    handleBack,
    handleCancel,
    handleCompleteConfirm,
    handleContentChange,
    handleImageChange,
    handleOpenFilePicker,
    handleRemoveCustomTag,
    handleRemoveExistingImage,
    handleRemoveImage,
    handleSubmit,
    handleTagTypeChange,
    handleTitleChange,
  } = useCommunityWriteForm();

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
        onConfirm={handleCompleteConfirm}
      />

      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-start gap-4">
          <button
            type="button"
            onClick={handleBack}
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
                  onChange={(event) => handleTagTypeChange(event.target.value)}
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
                        onClick={() => handleRemoveCustomTag(tag)}
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
                  onChange={(event) => handleTitleChange(event.target.value)}
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
                  onChange={(event) => handleContentChange(event.target.value)}
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
                  onClick={handleOpenFilePicker}
                  disabled={existingImageUrls.length + imagePreviews.length >= MAX_IMAGE_COUNT}
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
                  onClick={handleCancel}
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
