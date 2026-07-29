"use client";

import { ChevronLeft } from "lucide-react";
import CommunityPostModals from "@/features/community/components/PostDetail/CommunityPostModals";
import CommunityCommentSection from "@/features/community/components/PostDetail/CommunityCommentSection";
import CommunityPostHeader from "@/features/community/components/PostDetail/CommunityPostHeader";
import CommunityPostImageCarousel from "@/features/community/components/PostDetail/CommunityPostImageCarousel";
import CommunityPostStats from "@/features/community/components/PostDetail/CommunityPostStats";
import { useCommunityPostDetail } from "@/features/community/hooks/useCommunityPostDetail";
import type { CommunityPostDetailProps } from "@/features/community/types";

export default function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const {
    post,
    reaction,
    isLoading,
    isReacting,
    isReporting,
    isDeleting,
    isDeleteConfirmOpen,
    isDeleteCompleteOpen,
    isReportModalOpen,
    isReportCompleteOpen,
    isAlreadyReportedOpen,
    isLoginRequiredOpen,
    currentUserId,
    currentImageIndex,
    errorMessage,
    isInvalidPostId,
    isOwnPost,
    authorProfileImageUrl,
    closeLoginRequiredModal,
    setIsDeleteConfirmOpen,
    setIsReportModalOpen,
    setIsReportCompleteOpen,
    setIsAlreadyReportedOpen,
    handleBackToList,
    handleReaction,
    handleOpenReport,
    handleReport,
    handleEdit,
    handleDelete,
    handlePrevImage,
    handleNextImage,
    handleCommentCountChange,
  } = useCommunityPostDetail(postId);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-7">
      <CommunityPostModals
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        isDeleting={isDeleting}
        onCancelDelete={() => setIsDeleteConfirmOpen(false)}
        onConfirmDelete={handleDelete}
        isDeleteCompleteOpen={isDeleteCompleteOpen}
        onConfirmDeleteComplete={handleBackToList}
        isReportCompleteOpen={isReportCompleteOpen}
        onCloseReportComplete={() => setIsReportCompleteOpen(false)}
        isAlreadyReportedOpen={isAlreadyReportedOpen}
        onCloseAlreadyReported={() => setIsAlreadyReportedOpen(false)}
        isLoginRequiredOpen={isLoginRequiredOpen}
        onCloseLoginRequired={closeLoginRequiredModal}
        isReportModalOpen={isReportModalOpen}
        isReporting={isReporting}
        onCancelReport={() => setIsReportModalOpen(false)}
        onSubmitReport={handleReport}
      />

      <button
        type="button"
        onClick={handleBackToList}
        className="mx-auto mb-7 flex w-full max-w-3xl cursor-pointer items-center gap-2 text-sm font-semibold text-[#5F928E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D] focus-visible:ring-offset-2"
      >
        <ChevronLeft size={18} />
        목록으로
      </button>

      <section className="mx-auto max-w-3xl overflow-hidden rounded-[12px] border border-[#CFE0DE] bg-[#FFFDF8] shadow-[0_10px_24px_rgba(72,52,35,0.07)]">
        {isInvalidPostId ? (
          <CommunityPostStatusMessage
            message="올바르지 않은 게시글입니다."
            variant="error"
          />
        ) : isLoading ? (
          <CommunityPostStatusMessage message="게시글을 불러오는 중입니다." />
        ) : errorMessage || !post ? (
          <CommunityPostStatusMessage
            message={errorMessage || "게시글을 불러오지 못했습니다."}
            variant="error"
          />
        ) : (
          <>
            <CommunityPostHeader
              post={post}
              authorProfileImageUrl={authorProfileImageUrl}
              isOwnPost={isOwnPost}
              isDeleting={isDeleting}
              isReporting={isReporting}
              onEdit={handleEdit}
              onDeleteClick={() => setIsDeleteConfirmOpen(true)}
              onReport={handleOpenReport}
            />

            <article className="px-7 py-6">
              <h1 className="text-2xl font-bold text-[#2F2A26]">{post.title}</h1>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#7A6F66]">
                {post.content}
              </p>
            </article>

            <CommunityPostImageCarousel
              imageUrls={post.imageUrls}
              fallbackImageUrl={post.imageUrl}
              imageAlt={post.imageAlt}
              currentImageIndex={currentImageIndex}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
            />

            <CommunityPostStats
              post={post}
              reaction={reaction}
              isReacting={isReacting}
              onReaction={handleReaction}
            />

            <CommunityCommentSection
              key={post.postId}
              postId={post.postId}
              initialCommentCount={post.commentCount}
              initialComments={post.comments}
              currentUserId={currentUserId}
              onCommentCountChange={handleCommentCountChange}
            />
          </>
        )}
      </section>
    </main>
  );
}

function CommunityPostStatusMessage({
  message,
  variant = "default",
}: {
  message: string;
  variant?: "default" | "error";
}) {
  return (
    <div
      className={`px-7 py-16 text-center text-[15px] font-semibold ${
        variant === "error" ? "text-[#DC2626]" : "text-[#7A6F66]"
      }`}
    >
      {message}
    </div>
  );
}
