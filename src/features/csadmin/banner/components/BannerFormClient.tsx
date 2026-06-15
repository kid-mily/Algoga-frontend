"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import { useBannerForm } from "../hooks/useBannerForm";
import BannerMediaPreview from "./BannerMediaPreview";

type BannerFormClientProps = {
  mode: "create" | "edit";
  bannerId?: number;
};

export default function BannerFormClient({ mode, bannerId }: BannerFormClientProps) {
  const router = useRouter();
  const {
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
  } = useBannerForm(mode, bannerId);

  const title = mode === "create" ? "배너 등록" : "배너 수정";
  const completeTitle = mode === "create" ? "등록 완료" : "수정 완료";
  const completeDescription =
    mode === "create" ? "배너가 등록되었습니다." : "배너가 수정되었습니다.";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (mode === "edit") {
      setConfirmOpen(true);
      return;
    }

    void saveBanner();
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        배너 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main aria-labelledby="banner-form-title">
      <header className="mb-6">
        <SubHeader
          backHref="/csadmin/banner"
          backText="배너 목록으로 돌아가기"
          title={title}
          description="이미지 또는 영상, 연결 URL, 노출 상태를 설정하세요"
        />
        <span id="banner-form-title" className="sr-only">
          {title}
        </span>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <form onSubmit={handleSubmit} className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label htmlFor="banner-text" className="mb-3 block text-[14px] font-semibold text-[#344054]">
              배너 문구 <span className="text-red-500">*</span>
            </label>
            <input
              id="banner-text"
              value={formData.text}
              onChange={(event) => updateField("text", event.target.value)}
              placeholder="예: 여름 맞이 특가 이벤트 배너"
              className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label htmlFor="banner-link-url" className="mb-3 block text-[14px] font-semibold text-[#344054]">
              연결 URL <span className="text-red-500">*</span>
            </label>
            <input
              id="banner-link-url"
              type="url"
              value={formData.linkUrl}
              onChange={(event) => updateField("linkUrl", event.target.value)}
              placeholder="https://algoga.com/event"
              className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label htmlFor="banner-file" className="mb-3 block text-[14px] font-semibold text-[#344054]">
              배너 파일 {mode === "create" && <span className="text-red-500">*</span>}
            </label>
            <input
              id="banner-file"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="block w-full text-[14px] text-[#344054] file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#E7F4EC] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-[#439A97]"
            />
            <p className="mt-2 text-[13px] text-[#98A2B3]">
              {file ? `선택한 파일: ${file.name}` : mode === "edit" ? "새 파일을 선택하지 않으면 기존 미디어를 유지합니다." : "이미지 또는 영상을 선택하세요."}
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
            <header className="border-b border-[#E4E7EC] px-5 py-4">
              <h2 className="text-[16px] font-bold text-[#111827]">미리보기</h2>
            </header>
            <figure className="h-[220px] bg-[#F2F4F7]">
              <BannerMediaPreview
                src={mediaPreviewUrl}
                fileType={formData.fileType}
                alt={formData.text || "배너 미리보기"}
              />
            </figure>
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5">
            <h2 className="mb-4 text-[16px] font-bold text-[#111827]">노출 설정</h2>
            <label className="flex cursor-pointer items-center justify-between rounded-[12px] bg-[#F9FAFB] p-4 text-[14px] font-semibold text-[#344054]">
              메인 화면에 노출
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(event) => updateField("isVisible", event.target.checked)}
                className="h-5 w-5 accent-[#639E9B]"
              />
            </label>
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mb-3 h-[46px] w-full rounded-[10px] bg-[#639E9B] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {isSubmitting ? "저장 중..." : mode === "create" ? "등록하기" : "수정 완료"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/csadmin/banner")}
              className="h-[46px] w-full rounded-[10px] border border-[#E4E7EC] bg-white text-[14px] font-semibold text-[#344054]"
            >
              취소
            </button>
          </section>
        </aside>
      </form>

      <Modal
        open={confirmOpen}
        title="배너 수정"
        description="배너를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setConfirmOpen(false);
          void saveBanner();
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={completeTitle}
        description={completeDescription}
        buttonText="확인"
        onConfirm={() => {
          setCompleteOpen(false);
          router.push("/csadmin/banner");
        }}
      />
    </main>
  );
}
