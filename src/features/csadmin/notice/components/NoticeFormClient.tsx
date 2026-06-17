"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import Modal from "@/features/common/Modal";
import { useNoticeForm } from "../hooks/useNoticeForm";

type NoticeFormClientProps = {
  mode: "create" | "edit";
  noticeId?: number;
};

export default function NoticeFormClient({ mode, noticeId }: NoticeFormClientProps) {
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    formData,
    tagOptions,
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
  } = useNoticeForm(mode, noticeId);

  const title = mode === "create" ? "공지사항 등록" : "공지사항 수정";
  const completeDescription =
    mode === "create"
      ? "공지사항이 등록되었습니다."
      : "공지사항이 수정되었습니다.";
  const validationMessages = [
    "공지사항 제목을 입력해주세요.",
    "공지사항 내용을 입력해주세요.",
    "공지사항 태그를 선택해주세요.",
  ];
  const bannerError = validationMessages.includes(error) ? "" : error;
  const showTitleError = hasSubmitted && !formData.title.trim();
  const showContentError = hasSubmitted && !formData.content.trim();
  const showTagError = hasSubmitted && !formData.tag;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) return;

    if (mode === "edit") {
      setConfirmOpen(true);
      return;
    }

    void saveNotice();
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        공지사항 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main aria-labelledby="notice-form-title">
      <header className="mb-6">
        <SubHeader
          backHref="/csadmin/notice"
          backText="공지사항 목록으로 돌아가기"
          title={title}
          description="제목, 내용, 태그를 설정하세요"
        />
        <span id="notice-form-title" className="sr-only">
          {title}
        </span>
      </header>

      <AdminErrorBanner message={bannerError} className="mb-4" />

      <form onSubmit={handleSubmit} className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-6">
          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label htmlFor="notice-title" className="mb-3 block text-[14px] font-semibold text-[#344054]">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="notice-title"
              value={formData.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
            {showTitleError && (
              <p className="mt-2 text-[13px] font-semibold text-[#DC2626]">
                공지사항 제목을 입력해주세요.
              </p>
            )}
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label htmlFor="notice-content" className="mb-3 block text-[14px] font-semibold text-[#344054]">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="notice-content"
              value={formData.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="공지사항 내용을 입력하세요..."
              className="h-[360px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
            {showContentError && (
              <p className="mt-2 text-[13px] font-semibold text-[#DC2626]">
                공지사항 내용을 입력해주세요.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
            <header className="border-b border-[#E4E7EC] px-5 py-4">
              <h2 className="text-[16px] font-bold text-[#111827]">태그 설정</h2>
            </header>
            <div className="flex flex-wrap gap-2 p-5">
              {tagOptions.map((tag) => {
                const isSelected = formData.tag === tag.value;

                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => updateField("tag", tag.value)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
                      isSelected
                        ? "bg-[#E7F4EC] text-[#439A97]"
                        : "bg-[#F2F4F7] text-[#667085]"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
            {showTagError && (
              <p className="px-5 pb-5 text-[13px] font-semibold text-[#DC2626]">
                공지사항 태그를 선택해주세요.
              </p>
            )}
          </section>

          <section className="rounded-[16px] border border-[#BBF7D0] bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] p-5">
            <h2 className="mb-4 text-[16px] font-bold text-[#111827]">작성 팁</h2>
            <div className="space-y-3 text-[13px] font-semibold text-[#344054]">
              <p>· 명확하고 간결한 제목을 작성하세요</p>
              <p>· 중요한 안내는 첫 문단에 배치하세요</p>
              <p>· 태그를 활용해 공지 유형을 분류하세요</p>
            </div>
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
              onClick={() => router.push("/csadmin/notice")}
              className="h-[46px] w-full rounded-[10px] border border-[#E4E7EC] bg-white text-[14px] font-semibold text-[#344054]"
            >
              취소
            </button>
          </section>
        </aside>
      </form>

      <Modal
        open={confirmOpen}
        title="공지사항 수정"
        description="공지사항을 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setConfirmOpen(false);
          void saveNotice();
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={completeDescription}
        buttonText="확인"
        onConfirm={() => {
          setCompleteOpen(false);
          router.push("/csadmin/notice");
        }}
      />
    </main>
  );
}
