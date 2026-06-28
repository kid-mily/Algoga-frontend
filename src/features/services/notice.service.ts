import { api, ApiResponse } from "@/lib/api";
import { emptyNoticePageResult, Notice, NoticeAll, NoticeDetail, NoticeNavigationResult, NoticePageResult, NoticeType } from "../notice/components/types";

// 공지사항 목록 조회
export const getMainNotices = async (): Promise<Notice[]> => {
  try {
    // 메인 공지사항 API 요청
    const response = await api.get<ApiResponse<Notice[]>>("/api/v1/public/notices/main",
      {
        next: { revalidate: 600 },

        // 공지 조회 실패 시 전역 에러 처리를 띄우지 않도록 설정
        suppressGlobalError: true,
      }
    );

    // 응답 데이터가 배열이면 그대로 반환하고,
    // 배열이 아니면 빈 배열 반환
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[notice] 메인 공지 조회 실패:", error);

    // 메인 화면이 깨지지 않도록 빈 배열 반환
    return [];
  }
};

/**
 * 공지사항 목록 조회
 *
 * tag: 공지 유형
 * page: 페이지 번호
 */
export const getNoticeList = async (
  tag: NoticeType = "ALL",
  page = 1
): Promise<NoticePageResult> => {
  try {
    // 공지사항 목록 API 요청
    const response = await api.get<ApiResponse<NoticePageResult>>(`/api/v1/public/notices/${tag}/${page}`,
      {
        next: { revalidate: 600 },
      }
    );

    // 공지 목록 데이터 반환
    return response.data;
  } catch (error) {
    console.error("공지사항 목록을 불러오는데 실패했습니다:", error);

    // 화면이 깨지지 않도록 빈 공지 목록 기본값 반환
    return emptyNoticePageResult;
  }
};

// 공지사항 상세 조회
export const getNoticeDetail = async (
  noticeId: number
): Promise<NoticeDetail | null> => {
  try {
    const response = await api.get<ApiResponse<NoticeDetail>>(`/api/v1/public/notices/${noticeId}`,
      {
        next: { revalidate: 600 },
      }
    );

    return response.data;
  } catch (error) {
    console.error("공지사항 상세를 불러오는데 실패했습니다:", error);

    // 상세 데이터를 가져오지 못하면 null 반환
    return null;
  }
};

// 현재 공지 기준으로 이전글 / 다음글 조회
export const getNoticeNavigation = async (
  noticeId: number
): Promise<NoticeNavigationResult> => {
  // 전체 공지 목록의 첫 번째 페이지 조회
  const noticePage = await getNoticeList("ALL", 1);

  // 공지 목록 데이터
  const notices: NoticeAll[] = noticePage.content;

  // 현재 공지사항이 목록에서 몇 번째 위치인지 찾음
  const currentIndex = notices.findIndex(
    (notice) => notice.noticeId === noticeId
  );

  // 현재 공지사항을 목록에서 찾지 못한 경우
  if (currentIndex === -1) {
    return {
      previousNotice: null,
      nextNotice: null,
    };
  }

  // 다음 글
  const nextItem = notices[currentIndex - 1];

  // 이전글
  const previousItem = notices[currentIndex + 1];

  return {
    // 이전글이 있으면 noticeId와 title만 반환
    previousNotice: previousItem
      ? {
          noticeId: previousItem.noticeId,
          title: previousItem.title,
        }
      : null,

    // 다음글이 있으면 noticeId와 title만 반환
    nextNotice: nextItem
      ? {
          noticeId: nextItem.noticeId,
          title: nextItem.title,
        }
      : null,
  };
};