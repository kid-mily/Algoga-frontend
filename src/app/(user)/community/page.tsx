import CommunityPageClient from "@/features/community/components/main/CommunityPageClient";
import { type CommunityFilter } from "@/features/community/types";
import { DEFAULT_COMMUNITY_FILTERS } from "@/features/community/utils/communityDefaults";
import {
  getCommunityFilters,
  getCommunityPosts,
} from "@/features/services/community.service";

export const dynamic = "force-dynamic";

const isVisibleCategoryFilter = (filter: CommunityFilter) =>
  filter.tagType === "COUNTRY" || Boolean(filter.category);

const loadCommunityFilters = async () => {
  try {
    const filters = await getCommunityFilters();
    const visibleFilters = filters.filter(isVisibleCategoryFilter);

    return visibleFilters.length > 0 ? visibleFilters : DEFAULT_COMMUNITY_FILTERS;
  } catch {
    return DEFAULT_COMMUNITY_FILTERS;
  }
};

export default async function CommunityPage() {
  const filters = await loadCommunityFilters();
  const initialData = await getCommunityPosts().catch((error) => ({
    posts: [],
    lastPostId: null,
    hasNext: false,
    errorMessage:
      error instanceof Error
        ? error.message
        : "커뮤니티 게시글을 불러오지 못했습니다.",
  }));

  return (
    <CommunityPageClient
      initialFilters={filters}
      initialPosts={initialData.posts}
      initialLastPostId={initialData.lastPostId}
      initialHasNext={initialData.hasNext}
      initialErrorMessage={"errorMessage" in initialData ? initialData.errorMessage : ""}
    />
  );
}
