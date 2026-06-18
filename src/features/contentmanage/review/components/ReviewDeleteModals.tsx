import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { AdminReview } from "../types";

type ReviewDeleteModalsProps = {
  deleteTarget: AdminReview | null;
  deleteCompleteOpen: boolean;
  visibilityTarget: AdminReview | null;
  visibilityCompleteOpen: boolean;
  isProcessing: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCloseComplete: () => void;
  onConfirmVisibility: () => void;
  onCancelVisibility: () => void;
  onCloseVisibilityComplete: () => void;
};

export default function ReviewDeleteModals({
  deleteTarget,
  deleteCompleteOpen,
  visibilityTarget,
  visibilityCompleteOpen,
  isProcessing,
  onConfirmDelete,
  onCancelDelete,
  onCloseComplete,
  onConfirmVisibility,
  onCancelVisibility,
  onCloseVisibilityComplete,
}: ReviewDeleteModalsProps) {
  return (
    <>
      <Modal
        open={!!deleteTarget}
        title="후기 삭제"
        description="선택한 후기를 삭제하시겠습니까?"
        confirmText={isProcessing ? "처리 중..." : "삭제"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <CompleteModal
        open={deleteCompleteOpen}
        title="삭제 완료"
        description="삭제가 완료되었습니다."
        buttonText="확인"
        onConfirm={onCloseComplete}
      />

      <Modal
        open={!!visibilityTarget}
        title="후기 숨김 상태 변경"
        description={`선택한 후기를 ${visibilityTarget?.hidden ? "노출" : "숨김"} 처리하시겠습니까?`}
        confirmText={isProcessing ? "처리 중..." : "확인"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={onConfirmVisibility}
        onCancel={onCancelVisibility}
      />

      <CompleteModal
        open={visibilityCompleteOpen}
        title="처리 완료"
        description="후기 숨김 상태가 변경되었습니다."
        buttonText="확인"
        onConfirm={onCloseVisibilityComplete}
      />
    </>
  );
}
