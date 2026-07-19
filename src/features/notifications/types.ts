export type NotificationType =
  | "COURSE_REGISTERED"
  | "COURSE_COMPLETED"
  | "DDAY_REMINDER"
  | "QNA_ANSWERED"
  | "POST_COMMENTED"
  | "COMMENT_REPLIED"
  | "NOTICE_CREATED"
  | "INQUIRY_ANSWERED"
  | "FRIEND_REQUESTED"
  | "FRIEND_ACCEPTED"
  | "PAYMENT_COMPLETED"
  | "RESERVATION_CONFIRMED"
  | "REFUND_APPROVED"
  | "REFUND_REJECTED"
  | "SYSTEM";

export interface NotificationApiItem {
  notificationId: number;
  type: NotificationType;
  message: string;
  detail?: string | null;
  referenceId?: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  unreadCount: number;
  hasUnread: boolean;
  notifications: NotificationApiItem[];
  hasNext: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
