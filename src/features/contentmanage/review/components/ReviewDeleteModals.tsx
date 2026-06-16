import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { AdminReview } from "../types";

type ReviewDeleteModalsProps = {
  deleteTarget: AdminReview | null;
  deleteCompleteOpen: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCloseComplete: () => void;
};

export default function ReviewDeleteModals({
  deleteTarget,
  deleteCompleteOpen,
  onConfirmDelete,
  onCancelDelete,
  onCloseComplete,
}: ReviewDeleteModalsProps) {
  return (
    <>
      <Modal
        open={!!deleteTarget}
        title="후기 삭제"
        description="선택한 후기를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
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
    </>
  );
}
