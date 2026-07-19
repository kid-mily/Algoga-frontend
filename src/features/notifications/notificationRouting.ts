import type { NotificationType } from "./types";

// 알림 클릭 시 이동할 경로. 백엔드 라우팅 가이드의 경로를
// 실제 존재하는 라우트에 맞춰 교정했다.
// (community/posts/{id} -> community/{postid}, notices/{id} -> notice/{noticeId}, /friends -> /mypage/friends)
// INQUIRY_ANSWERED은 사용자용 문의 상세 페이지가 아직 없어서 이동하지 않는다.
export function getNotificationTargetPath(
  type: NotificationType,
  referenceId: number | null | undefined
): string | null {
  switch (type) {
    case "POST_COMMENTED":
    case "COMMENT_REPLIED":
      return referenceId ? `/community/${referenceId}` : null;

    case "NOTICE_CREATED":
      return referenceId ? `/notice/${referenceId}` : null;

    case "FRIEND_REQUESTED":
    case "FRIEND_ACCEPTED":
      return "/mypage/friends";

    default:
      return null;
  }
}
