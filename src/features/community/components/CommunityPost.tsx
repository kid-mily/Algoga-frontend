"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Eye, Flag, Heart, MessageCircle, ThumbsDown } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import {
  getCommunityPost,
  reactToCommunityPost,
  reportCommunityPost,
  type CommunityPost,
} from "@/features/services/community.service";

type CommunityPostDetailProps = {
  postId: number;
};

type ReactionState = true | false | null;

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export default function CommunityPostDetail({ postId }: CommunityPostDetailProps) {
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [reaction, setReaction] = useState<ReactionState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReacting, setIsReacting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isInvalidPostId = !Number.isFinite(postId) || postId <= 0;

  useEffect(() => {
    if (isInvalidPostId) return;

    const controller = new AbortController();

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getCommunityPost(postId, controller.signal);
        setPost(data);
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
        window.alert("좋아요/싫어요는 로그인 후 이용할 수 있습니다.");
        router.push(`/auth/login?redirect=${encodeURIComponent(`/community/${post.postId}`)}`);
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

  const handleReport = async () => {
    if (!post || isReporting) return;

    const detail = window.prompt("신고 사유를 입력해 주세요.");
    if (!detail?.trim()) return;

    try {
      setIsReporting(true);
      await reportCommunityPost({
        postId: post.postId,
        reasonType: "SPAM",
        detail: detail.trim(),
      });
      window.alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("[community] report failed", error);
      window.alert(getRequestErrorMessage(error, "신고 접수에 실패했습니다."));
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-7">
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="mx-auto mb-7 flex w-full max-w-3xl items-center gap-2 text-sm font-semibold text-[#5F928E]"
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
            <header className="flex items-start justify-between border-b border-[#CFE0DE] px-7 py-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6BA19D] text-lg font-bold text-white ring-4 ring-[#EEF4F4]">
                  {post.authorInitial}
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#2F2A26]">
                    {post.authorName}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-[#EEF4F4] px-2 py-1 font-semibold text-[#5F928E]">
                      {post.country}
                    </span>
                    <span className="rounded-[8px] border border-[#6BA19D] bg-[#6BA19D] px-2 py-1 font-bold text-white">
                      {post.category}
                    </span>
                    <span className="font-semibold text-[#9A8B7D]">
                      {post.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReport}
                disabled={isReporting}
                className="flex items-center gap-1 text-xs font-semibold text-[#9A8B7D] transition hover:text-[#5F928E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Flag size={16} />
                신고
              </button>
            </header>

            <article className="px-7 py-6">
              <h1 className="text-2xl font-bold text-[#2F2A26]">{post.title}</h1>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#7A6F66]">
                {post.content}
              </p>
            </article>

            {post.imageUrl && (
              <div className="relative h-[350px] border-y border-[#CFE0DE] bg-[#EEF4F4]">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 border-b border-[#CFE0DE] px-7 py-4 text-sm font-semibold text-[#7A6F66]">
              <button
                type="button"
                onClick={() => handleReaction(true)}
                disabled={isReacting}
                className={`flex items-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  reaction === true ? "text-[#5F928E]" : "hover:text-[#5F928E]"
                }`}
              >
                <Heart size={20} />
                {post.likeCount.toLocaleString()}
              </button>

              <button
                type="button"
                onClick={() => handleReaction(false)}
                disabled={isReacting}
                className={`flex items-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
          </>
        )}
      </section>
    </main>
  );
}
