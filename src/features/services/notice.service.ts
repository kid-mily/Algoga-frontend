import { api, ApiResponse } from "@/lib/api";
import { emptyNoticePageResult, Notice, NoticeAll, NoticeDetail, NoticeNavigationResult, NoticePageResult, NoticeType } from "../notice/components/types";

const NOTICE_REVALIDATE_SECONDS = 1800;

export const getMainNotices = async (): Promise<Notice[]> => {
  const response = await api.get<ApiResponse<Notice[]>>(
    "/api/v1/public/notices/main",
    {
      next: { revalidate: NOTICE_REVALIDATE_SECONDS },
    }
  );

  return response.data;
};

export const getNoticeList = async (
  tag: NoticeType = "ALL",
  page = 1
): Promise<NoticePageResult> => {
  try {
    const response = await api.get<ApiResponse<NoticePageResult>>(
      `/api/v1/public/notices/${tag}/${page}`,
      {
        next: { revalidate: NOTICE_REVALIDATE_SECONDS },
      }
    );

    return response.data;
  } catch (error) {
    console.error("공지사항 목록을 불러오는데 실패했습니다:", error);
    return emptyNoticePageResult;
  }
};

export const getNoticeDetail = async (
  noticeId: number
): Promise<NoticeDetail | null> => {
  try {
    const response = await api.get<ApiResponse<NoticeDetail>>(
      `/api/v1/public/notices/${noticeId}`,
      {
        next: { revalidate: NOTICE_REVALIDATE_SECONDS },
      }
    );

    return response.data;
  } catch (error) {
    console.error("공지사항 상세를 불러오는데 실패했습니다:", error);
    return null;
  }
};

export const getNoticeNavigation = async (
  noticeId: number
): Promise<NoticeNavigationResult> => {
  const noticePage = await getNoticeList("ALL", 1);
  const notices: NoticeAll[] = noticePage.content;

  const currentIndex = notices.findIndex(
    (notice) => notice.noticeId === noticeId
  );

  if (currentIndex === -1) {
    return {
      previousNotice: null,
      nextNotice: null,
    };
  }

  const nextItem = notices[currentIndex - 1];
  const previousItem = notices[currentIndex + 1];

  return {
    previousNotice: previousItem
      ? {
          noticeId: previousItem.noticeId,
          title: previousItem.title,
        }
      : null,
    nextNotice: nextItem
      ? {
          noticeId: nextItem.noticeId,
          title: nextItem.title,
        }
      : null,
  };
};