"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommunityCard from "@/features/community/components/CommunityCard";
import CommunityActionModal from "@/features/community/components/CommunityActionModal";
import CommunityHeader from "@/features/community/components/CommunityHeader";
import type { CommunityCategoryOption } from "@/features/community/types";
import { getMe } from "@/features/services/user.service";
import {
  getCommunityPosts,
  type CommunityFilter,
  type CommunityPost,
} from "@/features/services/community.service";

const ALL_CATEGORY_ID = "ALL";

type CommunityPageClientProps = {
  initialFilters: CommunityFilter[];
  initialPosts: CommunityPost[];
  initialLastPostId: number | null;
  initialHasNext: boolean;
  initialErrorMessage?: string;
};

export default function CommunityPageClient({
  initialFilters,
  initialPosts,
  initialLastPostId,
  initialHasNext,
  initialErrorMessage = "",
}: CommunityPageClientProps) {
  const router = useRouter();
  const [selectedFilterId, setSelectedFilterId] = useState<string>(ALL_CATEGORY_ID);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [lastPostId, setLastPostId] = useState<number | null>(initialLastPostId);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCheckingWriteAuth, setIsCheckingWriteAuth] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const categoryOptions = useMemo<CommunityCategoryOption[]>(
    () => [
      { id: ALL_CATEGORY_ID, label: "전체" },
      ...initialFilters.map((filter) => ({
        id: filter.id,
        label: filter.tagName,
      })),
    ],
    [initialFilters]
  );
  const selectedFilter = useMemo(
    () => initialFilters.find((filter) => filter.id === selectedFilterId),
    [initialFilters, selectedFilterId]
  );
  const selectedFilterIds = useMemo(() => [selectedFilterId], [selectedFilterId]);

  const loadPosts = useCallback(
    async ({
      nextLastPostId,
      append,
      signal,
    }: {
      nextLastPostId?: number | null;
      append?: boolean;
      signal?: AbortSignal;
    } = {}) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");

      try {
        const data = await getCommunityPosts({
          lastPostId: nextLastPostId,
          categories: selectedFilter?.category ? [selectedFilter.category] : undefined,
          signal,
        });

        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
        setLastPostId(data.lastPostId);
        setHasNext(data.hasNext);
      } catch (error) {
        if (signal?.aborted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "커뮤니티 게시글을 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [selectedFilter]
  );

  useEffect(() => {
    if (selectedFilterId === ALL_CATEGORY_ID) {
      setPosts(initialPosts);
      setLastPostId(initialLastPostId);
      setHasNext(initialHasNext);
      setErrorMessage(initialErrorMessage);
      return;
    }

    const controller = new AbortController();
    void loadPosts({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [
    initialErrorMessage,
    initialHasNext,
    initialLastPostId,
    initialPosts,
    loadPosts,
    selectedFilterId,
  ]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isLoading || isLoadingMore || !hasNext) {
          return;
        }

        void loadPosts({ nextLastPostId: lastPostId, append: true });
      },
      { rootMargin: "320px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNext, isLoading, isLoadingMore, lastPostId, loadPosts]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilterId((prev) => {
      if (filterId === ALL_CATEGORY_ID) return ALL_CATEGORY_ID;

      return prev === filterId ? ALL_CATEGORY_ID : filterId;
    });
  };

  const handleWriteClick = async () => {
    if (isCheckingWriteAuth) return;

    try {
      setIsCheckingWriteAuth(true);
      const user = await getMe();

      if (!user?.userId) {
        setIsLoginRequiredOpen(true);
        return;
      }

      router.push("/community/write");
    } finally {
      setIsCheckingWriteAuth(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F8FC]">
      <CommunityActionModal
        open={isLoginRequiredOpen}
        title="로그인 필요"
        description="로그인이 필요한 서비스입니다."
        confirmLabel="로그인 이동"
        cancelLabel="취소"
        onCancel={() => setIsLoginRequiredOpen(false)}
        onConfirm={() => {
          setIsLoginRequiredOpen(false);
          router.push(
            `/auth/login?redirect=${encodeURIComponent("/community/write")}`
          );
        }}
      />

      <CommunityHeader
        selectedCategories={selectedFilterIds}
        categories={categoryOptions}
        onCategoryChange={handleFilterChange}
        onWriteClick={handleWriteClick}
      />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-6 py-8">
        {errorMessage && (
          <div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-[15px] font-semibold text-[#DC2626]">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[12px] border border-[#E7D7C3] bg-[#FFFDF8] px-8 py-10 text-center text-[16px] font-semibold text-[#7A6F66]">
            커뮤니티 게시글을 불러오는 중입니다.
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[12px] border border-[#E7D7C3] bg-[#FFFDF8] px-8 py-10 text-center text-[16px] font-semibold text-[#7A6F66]">
            표시할 게시글이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {posts.map((post) => <CommunityCard key={post.postId} {...post} />)}
          </div>
        )}

        <div ref={loadMoreRef} className="h-8" />

        {isLoadingMore && (
          <p className="text-center text-[14px] font-semibold text-[#7A6F66]">
            게시글을 더 불러오는 중입니다.
          </p>
        )}
      </section>
    </main>
  );
}
