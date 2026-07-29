"use client";

import CommunityActionModal from "@/features/community/components/common/CommunityActionModal";
import CommunityReportModal from "@/features/community/components/common/CommunityReportModal";
import CommunityReportStatusModals from "@/features/community/components/common/CommunityReportStatusModals";
import type { CommunityReportReasonType } from "@/features/community/types";

type CommunityPostModalsProps = {
  isDeleteConfirmOpen: boolean;
  isDeleting: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeleteCompleteOpen: boolean;
  onConfirmDeleteComplete: () => void;
  isReportCompleteOpen: boolean;
  onCloseReportComplete: () => void;
  isAlreadyReportedOpen: boolean;
  onCloseAlreadyReported: () => void;
  isLoginRequiredOpen: boolean;
  onCloseLoginRequired: () => void;
  isReportModalOpen: boolean;
  isReporting: boolean;
  onCancelReport: () => void;
  onSubmitReport: (payload: {
    reasonType: CommunityReportReasonType;
    detail: string;
  }) => void;
};

// 게시글 상세의 삭제/신고 관련 모달 묶음. 본문 컴포넌트에서 모달 JSX를 분리한다.
export default function CommunityPostModals({
  isDeleteConfirmOpen,
  isDeleting,
  onCancelDelete,
  onConfirmDelete,
  isDeleteCompleteOpen,
  onConfirmDeleteComplete,
  isReportCompleteOpen,
  onCloseReportComplete,
  isAlreadyReportedOpen,
  onCloseAlreadyReported,
  isLoginRequiredOpen,
  onCloseLoginRequired,
  isReportModalOpen,
  isReporting,
  onCancelReport,
  onSubmitReport,
}: CommunityPostModalsProps) {
  return (
    <>
      <CommunityActionModal
        open={isDeleteConfirmOpen}
        title="게시글 삭제"
        description="삭제한 게시글은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        isPending={isDeleting}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />

      <CommunityActionModal
        open={isDeleteCompleteOpen}
        title="게시글 삭제 완료"
        description="게시글이 삭제되었습니다."
        confirmLabel="목록으로"
        onConfirm={onConfirmDeleteComplete}
      />

      <CommunityReportStatusModals
        targetLabel="게시글"
        isReportCompleteOpen={isReportCompleteOpen}
        onCloseReportComplete={onCloseReportComplete}
        isAlreadyReportedOpen={isAlreadyReportedOpen}
        onCloseAlreadyReported={onCloseAlreadyReported}
        isLoginRequiredOpen={isLoginRequiredOpen}
        onCloseLoginRequired={onCloseLoginRequired}
      />

      <CommunityReportModal
        open={isReportModalOpen}
        targetType="게시글"
        isPending={isReporting}
        onCancel={onCancelReport}
        onSubmit={onSubmitReport}
      />
    </>
  );
}
