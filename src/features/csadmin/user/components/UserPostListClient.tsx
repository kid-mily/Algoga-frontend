"use client";

import Image from "next/image";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";
import UserActivityTabs from "@/features/csadmin/user/UserActivityTabs";
import UserActivityConfirmModal from "@/features/csadmin/user/components/UserActivityConfirmModal";
import UserActivityPagination from "@/features/csadmin/user/components/UserActivityPagination";
import UserPostDetailModal from "@/features/csadmin/user/components/UserPostDetailModal";
import { useUserPostList } from "@/features/csadmin/user/hooks/useUserPostList";

type UserPostListClientProps = {
  userId: number;
};

export default function UserPostListClient({ userId }: UserPostListClientProps) {
  const {
    posts,
    selectedPost,
    deleteTarget,
    isLoading,
    isProcessing,
    error,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    setSelectedPost,
    setDeleteTarget,
    openPostDetail,
    confirmDelete,
  } = useUserPostList(userId);

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <UserActivityTabs userId={String(userId)} activeTab="posts" />

      <div className="p-6">
        <AdminErrorBanner message={error} className="mb-4" />

        {isLoading ? (
          <AdminLoadingState text="게시글 목록을 불러오는 중입니다..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] table-fixed border-collapse">
              <caption className="sr-only">회원 {userId} 게시글 목록</caption>
              <thead>
                <tr className="bg-[#F9FAFB] text-left text-[14px] font-semibold text-[#344054]">
                  <th scope="col" className="w-[140px] px-6 py-4">게시글 ID</th>
                  <th scope="col" className="px-6 py-4">제목</th>
                  <th scope="col" className="w-[150px] px-6 py-4">작성일</th>
                  <th scope="col" className="w-[110px] px-6 py-4">조회수</th>
                  <th scope="col" className="w-[110px] px-6 py-4">댓글 수</th>
                  <th scope="col" className="w-[120px] px-6 py-4">관리</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.postId} className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
                      <td className="px-6 py-5 font-semibold">{post.displayId}</td>
                      <td className="truncate px-6 py-5 font-bold text-[#111827]">{post.title}</td>
                      <td className="px-6 py-5 text-[#667085]">{post.createdAt}</td>
                      <td className="px-6 py-5">{post.viewCount.toLocaleString()}</td>
                      <td className="px-6 py-5">{post.commentCount.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => void openPostDetail(post.postId)} aria-label={`게시글 상세 보기: ${post.displayId}`}>
                            <Image src="/images/eye.svg" alt="" aria-hidden="true" width={17} height={17} sizes="17px" />
                          </button>
                          <button type="button" onClick={() => setDeleteTarget(post)} aria-label={`게시글 삭제: ${post.displayId}`}>
                            <Image src="/images/delete.svg" alt="" aria-hidden="true" width={17} height={17} sizes="17px" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[14px] text-[#667085]">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserActivityPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
      />

      <UserPostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      <UserActivityConfirmModal
        open={Boolean(deleteTarget)}
        title="게시글을 삭제하시겠습니까?"
        description="삭제된 게시글은 목록에서 제거됩니다."
        isProcessing={isProcessing}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
