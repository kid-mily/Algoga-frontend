import {
  COMMUNITY_CATEGORIES,
  type CommunityFilter,
} from "@/features/community/types";

// 서버 필터/태그 조회가 실패했거나 비어있을 때 사용하는 기본 카테고리 필터 목록.
// (커뮤니티 목록 페이지의 기본 필터와 글쓰기 폼의 기본 태그가 동일하므로 한 곳에서 관리한다.)
export const DEFAULT_COMMUNITY_FILTERS: CommunityFilter[] =
  COMMUNITY_CATEGORIES.map((category) => ({
    id: category.id,
    tagType: "CATEGORY",
    tagName: category.label,
    category: category.id,
  }));
