"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CommunityCard from "@/features/community/components/CommunityCard";
import CommunityHeader from "@/features/community/components/CommunityHeader";
import { COMMUNITY_CATEGORIES } from "@/features/community/components/CommunityCategory";
import type { CommunityCategoryOption } from "@/features/community/types";
import {
  getCommunityFilters,
  getCommunityPosts,
  type CommunityCategoryCode,
  type CommunityFilter,
  type CommunityPost,
} from "@/features/services/community.service";

const ALL_CATEGORY_ID = "ALL";

const isVisibleCategoryFilter = (filter: CommunityFilter) =>
  filter.tagType !== "COUNTRY" && filter.category !== "FREE";

const DEFAULT_FILTERS: CommunityFilter[] = COMMUNITY_CATEGORIES.filter(
  (category) => category.id !== "FREE"
).map((category) => ({
  id: category.id,
  tagType: "CATEGORY",
  tagName: category.label,
  category: category.id as CommunityCategoryCode,
}));

export default function CommunityPage() {
  const [selectedFilterId, setSelectedFilterId] = useState<string>(ALL_CATEGORY_ID);
  const [filters, setFilters] = useState<CommunityFilter[]>(DEFAULT_FILTERS);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [lastPostId, setLastPostId] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const categoryOptions = useMemo<CommunityCategoryOption[]>(
    () => [
      { id: ALL_CATEGORY_ID, label: "전체" },
      ...filters
        .filter(isVisibleCategoryFilter)
        .map((filter) => ({
          id: filter.id,
          label: filter.tagName,
        })),
    ],
    [filters]
  );
  const selectedFilter = useMemo(
    () => filters.find((filter) => filter.id === selectedFilterId),
    [filters, selectedFilterId]
  );
  const selectedFilterIds = useMemo(() => {
    return [selectedFilterId];
  }, [selectedFilterId]);

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
          countryId: selectedFilter?.countryId,
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
    const controller = new AbortController();

    const loadFilters = async () => {
      try {
        const data = await getCommunityFilters(controller.signal);
        const categoryFilters = data.filter(isVisibleCategoryFilter);

        if (categoryFilters.length > 0) {
          setFilters(categoryFilters);
        }
      } catch {
        setFilters(DEFAULT_FILTERS);
      }
    };

    void loadFilters();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadPosts({ signal: controller.signal });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadPosts]);

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

  const handleWriteClick = () => {
    window.location.href = "/community/write";
  };

  const handleFilterChange = (filterId: string) => {
    if (filterId === ALL_CATEGORY_ID) {
      setSelectedFilterId(ALL_CATEGORY_ID);
      return;
    }

    setSelectedFilterId((prev) => (prev === filterId ? ALL_CATEGORY_ID : filterId));
  };

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
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
