import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { AdminManager } from "../types";

type ManagerDeleteModalsProps = {
  deleteTarget: AdminManager | null;
  completeOpen: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCloseComplete: () => void;
};

export default function ManagerDeleteModals({
  deleteTarget,
  completeOpen,
  onConfirmDelete,
  onCancelDelete,
  onCloseComplete,
}: ManagerDeleteModalsProps) {
  return (
    <>
      <Modal
        open={!!deleteTarget}
        title="관리자 삭제"
        description="선택한 관리자 계정을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <CompleteModal
        open={completeOpen}
        title="삭제 완료"
        description="관리자 계정이 삭제되었습니다."
        buttonText="확인"
        onConfirm={onCloseComplete}
      />
    </>
  );
}
