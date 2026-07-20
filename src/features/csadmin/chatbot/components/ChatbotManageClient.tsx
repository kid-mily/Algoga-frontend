"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { deleteAdminSuggestedQuestion } from "@/features/services/adminChatbot.service";
import { getErrorMessage } from "@/features/services/error.service";
import { useChatbotQuestionList } from "../hooks/useChatbotQuestionList";
import { ChatbotQuestion } from "../types";
import ChatbotQuestionTable from "./ChatbotQuestionTable";
import ChatbotToolbar from "./ChatbotToolbar";

export default function ChatbotManageClient() {
  const {
    filteredQuestions,
    totalCount,
    searchKeyword,
    isLoading,
    error,
    setSearchKeyword,
    setError,
    refetch,
  } = useChatbotQuestionList();
  const [deleteTarget, setDeleteTarget] = useState<ChatbotQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteAdminSuggestedQuestion(deleteTarget.id);
      setDeleteTarget(null);
      await refetch();
      setCompleteMessage("예상 질문이 삭제되었습니다.");
    } catch (deleteError: unknown) {
      // 에러 시 확인 모달을 닫아 상단 에러 배너가 보이도록 한다.
      setDeleteTarget(null);
      setError(getErrorMessage(deleteError, "예상 질문 삭제에 실패했습니다."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main aria-labelledby="chatbot-management-title" className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <SimpleSubHeader
            title="챗봇 예상 질문 관리"
            description="사용자 챗봇에 노출되는 예상 질문과 답변을 관리합니다."
          />
          <span id="chatbot-management-title" className="sr-only">
            챗봇 예상 질문 관리
          </span>
        </div>

        <Link
          href="/csadmin/chatbot/new"
          className="mt-10 inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#2FAE9B] px-5 text-[15px] font-semibold text-white"
        >
          <Plus size={18} />
          예상 질문 등록
        </Link>
      </header>

      <AdminErrorBanner message={error} />

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white shadow-sm">
        <ChatbotToolbar
          searchKeyword={searchKeyword}
          onSearchKeywordChange={setSearchKeyword}
        />
        <ChatbotQuestionTable
          questions={filteredQuestions}
          isLoading={isLoading}
          onDelete={setDeleteTarget}
        />
      </section>

      <footer className="rounded-[16px] border border-[#E4E7EC] bg-white px-6 py-4 text-[13px] text-[#98A2B3]">
        <p>총 {totalCount}개</p>
      </footer>

      <Modal
        open={Boolean(deleteTarget)}
        title="예상 질문 삭제"
        description={
          deleteTarget
            ? `"${deleteTarget.question}" 예상 질문을 삭제하시겠습니까?`
            : "예상 질문을 삭제하시겠습니까?"
        }
        confirmText={isDeleting ? "삭제 중..." : "삭제"}
        cancelText="취소"
        confirmDisabled={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CompleteModal
        open={Boolean(completeMessage)}
        title="삭제 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => setCompleteMessage("")}
      />
    </main>
  );
}
