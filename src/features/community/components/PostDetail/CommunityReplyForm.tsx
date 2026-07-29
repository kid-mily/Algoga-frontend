"use client";

import { useState } from "react";
import CommunityCommentForm from "./CommunityCommentForm";

type CommunityReplyFormProps = {
  disabled?: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

// 답글 입력을 로컬 상태로 소유해, 타이핑 리렌더가 댓글 트리 전체로 전파되지 않게 한다.
// (활성 댓글에서만 마운트되므로 열 때마다 빈 상태로 시작한다.)
export default function CommunityReplyForm({
  disabled = false,
  onSubmit,
  onCancel,
}: CommunityReplyFormProps) {
  const [value, setValue] = useState("");

  return (
    <div className="mt-3 rounded-[14px] bg-[#F8FAFC] p-3">
      <CommunityCommentForm
        value={value}
        placeholder="대댓글을 입력하세요..."
        submitLabel="답글 등록"
        disabled={disabled}
        onChange={setValue}
        onSubmit={() => onSubmit(value)}
      />
      <button
        type="button"
        onClick={onCancel}
        className="mt-2 cursor-pointer text-xs font-bold text-[#7A6F66] hover:text-[#5F928E]"
      >
        취소
      </button>
    </div>
  );
}
