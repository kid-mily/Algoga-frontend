import type { NotificationType } from "./types";

// 백엔드가 정의한 타입별 아이콘 그룹("아이콘 바운더리")에 맞춰
// public/images에 있는 기존 아이콘으로 매핑한다
export const NOTIFICATION_TYPE_ICON: Record<NotificationType, string> = {
  COURSE_REGISTERED: "/images/BookIcon.svg",
  COURSE_COMPLETED: "/images/BookIcon.svg",
  DDAY_REMINDER: "/images/BookIcon.svg",

  QNA_ANSWERED: "/images/qna.svg",

  POST_COMMENTED: "/images/commucomment.svg",
  COMMENT_REPLIED: "/images/commucomment.svg",

  NOTICE_CREATED: "/images/notice.svg",

  INQUIRY_ANSWERED: "/images/mail.svg",

  FRIEND_REQUESTED: "/images/FriendIcon.svg",
  FRIEND_ACCEPTED: "/images/FriendIcon.svg",

  PAYMENT_COMPLETED: "/images/Payment.svg",
  RESERVATION_CONFIRMED: "/images/Payment.svg",
  REFUND_APPROVED: "/images/Payment.svg",
  REFUND_REJECTED: "/images/Payment.svg",
  SYSTEM: "/images/Payment.svg",
};
