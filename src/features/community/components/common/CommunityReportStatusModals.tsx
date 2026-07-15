"use client";

import CommunityActionModal from "@/features/community/components/common/CommunityActionModal";

type CommunityReportStatusModalsProps = {
  targetLabel: string;
  isReportCompleteOpen: boolean;
  onCloseReportComplete: () => void;
  isAlreadyReportedOpen: boolean;
  onCloseAlreadyReported: () => void;
  isLoginRequiredOpen: boolean;
  onCloseLoginRequired: () => void;
};

// 게시글/댓글 신고 접수·중복신고·로그인필요 안내 모달 (문구만 targetLabel로 치환)
export default function CommunityReportStatusModals({
  targetLabel,
  isReportCompleteOpen,
  onCloseReportComplete,
  isAlreadyReportedOpen,
  onCloseAlreadyReported,
  isLoginRequiredOpen,
  onCloseLoginRequired,
}: CommunityReportStatusModalsProps) {
  return (
    <>
      <CommunityActionModal
        open={isReportCompleteOpen}
        title={`${targetLabel} 신고 접수`}
        description={`${targetLabel} 신고가 접수되었습니다.`}
        confirmLabel="확인"
        onConfirm={onCloseReportComplete}
      />

      <CommunityActionModal
        open={isAlreadyReportedOpen}
        title={`이미 신고한 ${targetLabel}`}
        description={`이미 신고한 ${targetLabel}입니다.`}
        confirmLabel="확인"
        onConfirm={onCloseAlreadyReported}
      />

      <CommunityActionModal
        open={isLoginRequiredOpen}
        title="로그인 필요"
        description="로그인이 필요한 서비스입니다."
        confirmLabel="확인"
        onConfirm={onCloseLoginRequired}
      />
    </>
  );
}
