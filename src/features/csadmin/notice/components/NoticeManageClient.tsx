"use client";

import Link from "next/link";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { AdminNotice } from "../types";
import { useAdminNoticeList } from "../hooks/useAdminNoticeList";
import NoticeTable from "./NoticeTable";
import NoticeToolbar from "./NoticeToolbar";

type NoticeManageClientProps = {
  initialNotices: AdminNotice[];
};

export default function NoticeManageClient({ initialNotices }: NoticeManageClientProps) {
  const {
    searchKeyword,
    selectedTag,
    filteredNotices,
    totalCount,
    isLoading,
    error,
    noticeMessage,
    deleteTargetId,
    setSearchKeyword,
    setSelectedTag,
    setNoticeMessage,
    openDeleteModal,
    closeDeleteModal,
    deleteNotice,
  } = useAdminNoticeList(initialNotices);

  return (
    <main aria-labelledby="notice-management-title">
      <header className="mb-3 flex items-start justify-between gap-4">
        <div>
          <SimpleSubHeader
            title="공지사항 관리"
            description={`총 ${totalCount}건의 공지사항을 관리합니다.`}
          />
          <span id="notice-management-title" className="sr-only">
            공지사항 관리
          </span>
        </div>

        <Link
          href="/csadmin/notice/new"
          style={{ width: 136, minWidth: 136, height: 46, boxSizing: "border-box" }}
          className="mt-10 inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-[#639E9B] text-[15px] font-semibold text-white"
        >
          공지사항 등록
        </Link>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <NoticeToolbar
        searchKeyword={searchKeyword}
        selectedTag={selectedTag}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedTagChange={setSelectedTag}
      />

      <NoticeTable
        notices={filteredNotices}
        isLoading={isLoading}
        onDelete={openDeleteModal}
      />

      <Modal
        open={Boolean(deleteTargetId)}
        title="공지사항 삭제"
        description="공지사항을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={deleteNotice}
        onCancel={closeDeleteModal}
      />

      <CompleteModal
        open={Boolean(noticeMessage)}
        title="알림"
        description={noticeMessage}
        buttonText="확인"
        onConfirm={() => setNoticeMessage("")}
      />
    </main>
  );
}
