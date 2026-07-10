"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import CommunityActionModal from "@/features/community/components/CommunityActionModal";
import CommunityCommentSection from "@/features/community/components/CommunityCommentSection";
import CommunityReportModal from "@/features/community/components/CommunityReportModal";
import { useLoginRequiredModal } from "@/features/community/hooks/useLoginRequiredModal";
import { getMe } from "@/features/services/user.service";
import {
  deleteCommunityPost,
  getCommunityPost,
  reactToCommunityPost,
  reportCommunityPost,
} from "@/features/services/community.service";
import {
  type CommunityPost,
  type CommunityPostDetailProps,
  type CommunityReportReasonType,
  type ReactionState,
} from "../types";

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const isAlreadyReportedError = (error: unknown) => {
  const message = getRequestErrorMessage(error, "");
  const code = error instanceof ApiRequestError ? error.code ?? "" : "";

  return (
    (error instanceof ApiRequestError && error.status === 409) ||
    message.includes("이미 신고") ||
    code.includes("ALREADY_REPORTED")
  );
};

export default function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [reaction, setReaction] = useState<ReactionState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReacting, setIsReacting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteCompleteOpen, setIsDeleteCompleteOpen] = useState(false);
  const {
    isLoginRequiredOpen,
    openLoginRequiredModal,
    closeLoginRequiredModal,
  } = useLoginRequiredModal();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportCompleteOpen, setIsReportCompleteOpen] = useState(false);
  const [isAlreadyReportedOpen, setIsAlreadyReportedOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserProfileImageUrl, setCurrentUserProfileImageUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const isInvalidPostId = !Number.isFinite(postId) || postId <= 0;
  const isOwnPost = Boolean(
    post && (post.isMine || (post.authorId && currentUserId === post.authorId))
  );
  const authorProfileImageUrl =
    post?.authorProfileImageUrl || (isOwnPost ? currentUserProfileImageUrl : null);
  const postImages = post?.imageUrls ?? [];
  const currentImageUrl = postImages[currentImageIndex] ?? post?.imageUrl;
  const hasMultipleImages = postImages.length > 1;

  useEffect(() => {
    if (isInvalidPostId) return;
    const controller = new AbortController();
    const loadPost = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [data, user] = await Promise.all([
          getCommunityPost(postId, controller.signal),
          getMe(controller.signal),
        ]);
        setPost(data);
        setCurrentImageIndex(0);
        setCurrentUserId(user?.userId ?? null);
        setCurrentUserProfileImageUrl(user?.profileImageUrl ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error ? error.message : "게시글을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      controller.abort();
    };
  }, [isInvalidPostId, postId]);

  const handleReaction = async (isLike: boolean) => {
    if (!post || isReacting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    try {
      setIsReacting(true);

      const result = await reactToCommunityPost({
        postId: post.postId,
        isLike,
      });

      setPost((prev) =>
        prev
          ? {
              ...prev,
              likeCount: result.likeCount,
              dislikeCount: result.dislikeCount,
            }
          : prev
      );
      setReaction(result.status === "REMOVED" ? null : isLike);
    } catch (error) {
      console.error("[community] reaction failed", error);

      if (error instanceof ApiRequestError && error.status === 401) {
        openLoginRequiredModal();
        return;
      }

      if (error instanceof ApiRequestError && error.status === 403) {
        window.alert("이 게시글에 반응할 권한이 없습니다.");
        return;
      }

      window.alert(getRequestErrorMessage(error, "반응 처리에 실패했습니다."));
    } finally {
      setIsReacting(false);
    }
  };

  const handleOpenReport = () => {
    if (!post || isReporting) return;

    if (!currentUserId) {
      openLoginRequiredModal();
      return;
    }

    setIsReportModalOpen(true);
  };

  const handleReport = async ({
    reasonType,
    detail,
  }: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => {
    if (!post || isReporting) return;
    if (!detail.trim()) return;

    try {
      setIsReporting(true);
      await reportCommunityPost({
        postId: post.postId,
        reasonType,
        detail,
      });
      setIsReportModalOpen(false);
      setIsReportCompleteOpen(true);
    } catch (error) {
      if (isAlreadyReportedError(error)) {
        setIsReportModalOpen(false);
        setIsAlreadyReportedOpen(true);
        return;
      }

      console.error("[community] report failed", error);
      window.alert(getRequestErrorMessage(error, "신고 접수에 실패했습니다."));
    } finally {
      setIsReporting(false);
    }
  };

  const handleEdit = () => {
    if (!post) return;

    router.push(`/community/write?postId=${post.postId}`);
  };

  const handleDelete = async () => {
    if (!post || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteCommunityPost(post.postId);
      setIsDeleteConfirmOpen(false);
      setIsDeleteCompleteOpen(true);
    } catch (error) {
      window.alert(getRequestErrorMessage(error, "게시글 삭제에 실패했습니다."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevImage = () => {
    if (!postImages.length) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? postImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!postImages.length) return;

    setCurrentImageIndex((prev) =>
      prev === postImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-7">
      <CommunityActionModal
        open={isDeleteConfirmOpen}
        title="게시글 삭제"
        description="삭제한 게시글은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        isPending={isDeleting}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <CommunityActionModal
        open={isDeleteCompleteOpen}
        title="게시글 삭제 완료"
        description="게시글이 삭제되었습니다."
        confirmLabel="목록으로"
        onConfirm={() => router.push("/community")}
      />

      <CommunityActionModal
        open={isLoginRequiredOpen}
        title="로그인 필요"
        description="로그인이 필요한 서비스입니다."
        confirmLabel="확인"
        onConfirm={closeLoginRequiredModal}
      />

      <CommunityActionModal
        open={isReportCompleteOpen}
        title="게시글 신고 접수"
        description="게시글 신고가 접수되었습니다."
        confirmLabel="확인"
        onConfirm={() => setIsReportCompleteOpen(false)}
      />

      <CommunityActionModal
        open={isAlreadyReportedOpen}
        title="이미 신고한 게시글"
        description="이미 신고한 게시글입니다."
        confirmLabel="확인"
        onConfirm={() => setIsAlreadyReportedOpen(false)}
      />

      <CommunityReportModal
        open={isReportModalOpen}
        targetType="게시글"
        isPending={isReporting}
        onCancel={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />

      <button
        type="button"
        onClick={() => router.push("/community")}
        className="mx-auto mb-7 flex w-full max-w-3xl cursor-pointer items-center gap-2 text-sm font-semibold text-[#5F928E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D] focus-visible:ring-offset-2"
      >
        <ChevronLeft size={18} />
        목록으로
      </button>

      <section className="mx-auto max-w-3xl overflow-hidden rounded-[12px] border border-[#CFE0DE] bg-[#FFFDF8] shadow-[0_10px_24px_rgba(72,52,35,0.07)]">
        {isInvalidPostId ? (
          <div className="px-7 py-16 text-center text-[15px] font-semibold text-[#DC2626]">
            올바르지 않은 게시글입니다.
          </div>
        ) : isLoading ? (
          <div className="px-7 py-16 text-center text-[15px] font-semibold text-[#7A6F66]">
            게시글을 불러오는 중입니다.
          </div>
        ) : errorMessage || !post ? (
          <div className="px-7 py-16 text-center text-[15px] font-semibold text-[#DC2626]">
            {errorMessage || "게시글을 불러오지 못했습니다."}
          </div>
        ) : (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-[#CFE0DE] px-7 py-6">
              <div className="flex min-w-0 items-center gap-4">
                {authorProfileImageUrl ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-[#EEF4F4]">
                    <Image
                      src={authorProfileImageUrl}
                      alt={`${post.authorName} 프로필 이미지`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6BA19D] text-lg font-bold text-white ring-4 ring-[#EEF4F4]">
                    {post.authorInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold leading-5 text-[#2F2A26]">
                    {post.authorName}
                  </h2>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {post.countryId && (
                      <span className="flex h-6 items-center rounded-full bg-[#EEF4F4] px-2.5 text-xs font-bold text-[#5F928E]">
                        {post.country}
                      </span>
                    )}
                    <span className="flex h-6 items-center rounded-full border border-[#6BA19D] bg-[#6BA19D] px-2.5 text-xs font-bold text-white">
                      {post.category}
                    </span>
                    <span className="text-xs font-semibold text-[#9A8B7D]">
                      {post.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {isOwnPost ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CFE0DE] text-[#5F928E] transition hover:bg-[#EEF4F4]"
                    aria-label="게시글 수정"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    disabled={isDeleting}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FECACA] text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="게시글 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenReport}
                  disabled={isReporting}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-[#CFE0DE] bg-white px-3 text-xs font-bold text-[#7A6F66] transition hover:border-[#6BA19D] hover:bg-[#EEF4F4] hover:text-[#5F928E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Flag size={16} />
                  신고
                </button>
              )}
            </header>

            <article className="px-7 py-6">
              <h1 className="text-2xl font-bold text-[#2F2A26]">{post.title}</h1>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#7A6F66]">
                {post.content}
              </p>
            </article>

            {currentImageUrl && (
              <div className="relative h-[350px] border-y border-[#CFE0DE] bg-[#EEF4F4]">
                <Image
                  src={currentImageUrl}
                  alt={`${post.imageAlt} 이미지 ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#5F928E] shadow-[0_6px_16px_rgba(47,42,38,0.16)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D]"
                      aria-label="이전 사진 보기"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#5F928E] shadow-[0_6px_16px_rgba(47,42,38,0.16)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D]"
                      aria-label="다음 사진 보기"
                    >
                      <ChevronRight size={22} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
                      {currentImageIndex + 1} / {postImages.length}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 border-b border-[#CFE0DE] px-7 py-4 text-sm font-semibold text-[#7A6F66]">
              <button
                type="button"
                onClick={() => handleReaction(true)}
                disabled={isReacting}
                className={`flex cursor-pointer items-center gap-2 transition disabled:opacity-60 ${
                  reaction === true ? "text-[#E05252]" : "hover:text-[#E05252]"
                }`}
              >
                <Heart size={20} />
                {post.likeCount.toLocaleString()}
              </button>

              <button
                type="button"
                onClick={() => handleReaction(false)}
                disabled={isReacting}
                className={`flex cursor-pointer items-center gap-2 transition disabled:opacity-60 ${
                  reaction === false ? "text-[#5F928E]" : "hover:text-[#5F928E]"
                }`}
              >
                <ThumbsDown size={20} />
                {post.dislikeCount.toLocaleString()}
              </button>

              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                {post.commentCount.toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <Eye size={20} />
                {post.viewCount.toLocaleString()}
              </div>
            </div>

            <CommunityCommentSection
              postId={post.postId}
              initialCommentCount={post.commentCount}
              initialComments={post.comments}
              currentUserId={currentUserId}
              onCommentCountChange={(count) =>
                setPost((prev) =>
                  prev
                    ? {
                        ...prev,
                        commentCount: count,
                      }
                    : prev
                )
              }
            />
          </>
        )}
      </section>
    </main>
  );
}
