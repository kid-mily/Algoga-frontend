import { AdminUserComment } from "@/features/csadmin/user/types";

type UserCommentDetailModalProps = {
  comment: AdminUserComment | null;
  onClose: () => void;
};

export default function UserCommentDetailModal({ comment, onClose }: UserCommentDetailModalProps) {
  if (!comment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <section className="w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-xl" role="dialog" aria-modal="true" aria-labelledby="user-comment-detail-title">
        <header className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-5">
          <h2 id="user-comment-detail-title" className="text-[20px] font-bold text-[#111827]">
            댓글 상세
          </h2>
          <button type="button" onClick={onClose} className="text-[24px] text-[#98A2B3]" aria-label="댓글 상세 닫기">
            ×
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <InfoBlock label="댓글 ID" value={comment.displayId} />
          <InfoBlock label="게시글 제목" value={comment.postTitle} />
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#667085]">댓글 내용</p>
            <div className="rounded-[10px] bg-[#F9FAFB] px-4 py-4 text-[14px] font-semibold leading-[1.7] text-[#111827]">
              {comment.content || "내용이 없습니다."}
            </div>
          </div>
          <InfoBlock label="작성일" value={comment.createdAt} />
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-[#667085]">{label}</p>
      <p className="text-[14px] font-semibold text-[#111827]">{value}</p>
    </div>
  );
}
