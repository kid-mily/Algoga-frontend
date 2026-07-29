// 백엔드가 관리자 목록 API 응답을 배열에서 Spring 페이지 객체로 바꾸면서
// 공통으로 쓰는 페이지 메타 타입과, 구/신 응답을 모두 견디는 파싱 헬퍼를 모아둔다.

export type PageMeta = {
  page: number;
  totalPages: number;
  totalElements: number;
};

export type SpringPage<T> = PageMeta & {
  content: T[];
  size: number;
  first: boolean;
  last: boolean;
};

const toPageMeta = (
  source: Record<string, unknown>,
  fallbackTotal: number
): PageMeta => ({
  page: typeof source.page === "number" ? source.page : 0,
  totalPages:
    typeof source.totalPages === "number" && source.totalPages > 0
      ? source.totalPages
      : 1,
  totalElements:
    typeof source.totalElements === "number"
      ? source.totalElements
      : fallbackTotal,
});

// 배열(구버전) 또는 { content, totalPages, ... } 페이지 객체(신버전) 중
// 무엇이 오든 content 배열과 페이지 메타를 안전하게 뽑아낸다.
export const readPage = <T>(
  source: unknown
): { content: T[]; meta: PageMeta } => {
  if (Array.isArray(source)) {
    return {
      content: source as T[],
      meta: { page: 0, totalPages: 1, totalElements: source.length },
    };
  }

  if (source && typeof source === "object") {
    const obj = source as Record<string, unknown>;
    const content = Array.isArray(obj.content) ? (obj.content as T[]) : [];

    return { content, meta: toPageMeta(obj, content.length) };
  }

  return { content: [], meta: { page: 0, totalPages: 1, totalElements: 0 } };
};

// content 배열은 이미 다른 방식(getItems 등)으로 뽑았고 페이지 메타만 필요한 경우 사용한다.
export const readPageMeta = (
  source: unknown,
  fallbackTotal: number
): PageMeta => {
  if (source && typeof source === "object" && !Array.isArray(source)) {
    return toPageMeta(source as Record<string, unknown>, fallbackTotal);
  }

  return { page: 0, totalPages: 1, totalElements: fallbackTotal };
};
