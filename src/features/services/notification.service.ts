import { api, ApiRequestError, ApiResponse, unwrapData } from "@/lib/api";
import type { NotificationListResponse } from "@/features/notifications/types";

export interface NotificationSettings {
  learningEnabled: boolean;
  qnaEnabled: boolean;
  communityEnabled: boolean;
  noticeEnabled: boolean;
  inquiryEnabled: boolean;
  friendEnabled: boolean;
}

export class NotificationApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "NotificationApiError";
    this.status = status;
  }
}

// 내 알림 설정 조회
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await api.get<ApiResponse<NotificationSettings>>(
      "/api/v1/users/me/notifications/settings",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 설정을 불러오지 못했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 설정을 불러오지 못했습니다.");
  }
}

// 내 알림 설정 변경
export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<NotificationSettings> {
  try {
    const response = await api.patch<ApiResponse<NotificationSettings>>(
      "/api/v1/users/me/notifications/settings",
      settings,
      {
        suppressGlobalError: true,
      }
    );

    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 설정 변경에 실패했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 설정 변경에 실패했습니다.");
  }
}

// 읽지 않은 알림 개수 (헤더 종 배지용, 폴링으로 주기 호출)
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await api.get<ApiResponse<{ count: number }>>(
      "/api/v1/notifications/unread-count",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapData(response).count;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 개수를 불러오지 못했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 개수를 불러오지 못했습니다.");
  }
}

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  isRead?: boolean;
}

// 알림 목록 (헤더 드롭다운 미리보기, 전체 알림 페이지 둘 다 사용)
export async function getNotifications(
  params: GetNotificationsParams = {}
): Promise<NotificationListResponse> {
  try {
    const response = await api.get<ApiResponse<NotificationListResponse>>(
      "/api/v1/notifications",
      {
        params: {
          page: params.page,
          size: params.size,
          isRead: params.isRead,
        },
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 목록을 불러오지 못했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 목록을 불러오지 못했습니다.");
  }
}

// 알림 개별 읽음 처리 (알림 클릭 시 호출)
export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  try {
    await api.patch<ApiResponse<unknown>>(
      `/api/v1/notifications/${notificationId}/read`,
      undefined,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 읽음 처리에 실패했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 읽음 처리에 실패했습니다.");
  }
}

// 알림 개별 삭제
export async function deleteNotification(
  notificationId: number
): Promise<void> {
  try {
    await api.delete<ApiResponse<unknown>>(
      `/api/v1/notifications/${notificationId}`,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 삭제에 실패했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 삭제에 실패했습니다.");
  }
}

// 알림 전체 삭제
export async function deleteAllNotifications(): Promise<void> {
  try {
    await api.delete<ApiResponse<unknown>>("/api/v1/notifications", {
      suppressGlobalError: true,
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 전체 삭제에 실패했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 전체 삭제에 실패했습니다.");
  }
}

// 알림 전체 읽음 처리
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await api.patch<ApiResponse<unknown>>(
      "/api/v1/notifications/read-all",
      undefined,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new NotificationApiError(
        error.message || "알림 전체 읽음 처리에 실패했습니다.",
        error.status
      );
    }

    throw new NotificationApiError("알림 전체 읽음 처리에 실패했습니다.");
  }
}
