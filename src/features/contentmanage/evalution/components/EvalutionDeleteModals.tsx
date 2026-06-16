import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { EvalutionQuestion } from "../types";

type EvalutionDeleteModalsProps = {
  deleteTarget: EvalutionQuestion | null;
  deleteCompleteOpen: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCloseComplete: () => void;
};

export default function EvalutionDeleteModals({
  deleteTarget,
  deleteCompleteOpen,
  onConfirmDelete,
  onCancelDelete,
  onCloseComplete,
}: EvalutionDeleteModalsProps) {
  return (
    <>
      <Modal
        open={!!deleteTarget}
        title="문제 삭제"
        description="선택한 진단평가 문제를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <CompleteModal
        open={deleteCompleteOpen}
        title="삭제 완료"
        description="진단평가 문제가 삭제되었습니다."
        buttonText="확인"
        onConfirm={onCloseComplete}
      />
    </>
  );
}
