"use client";

import Link from "next/link";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { AdminBanner } from "../types";
import { useAdminBannerList } from "../hooks/useAdminBannerList";
import BannerCard from "./BannerCard";
import BannerToolbar from "./BannerToolbar";

type BannerManageClientProps = {
  initialBanners?: AdminBanner[];
};

export default function BannerManageClient({ initialBanners = [] }: BannerManageClientProps) {
  const {
    searchKeyword,
    visibilityFilter,
    filteredBanners,
    totalCount,
    activeCount,
    isLoading,
    error,
    message,
    deleteTargetId,
    setSearchKeyword,
    setVisibilityFilter,
    setMessage,
    openDeleteModal,
    closeDeleteModal,
    deleteBanner,
  } = useAdminBannerList(initialBanners);

  return (
    <main aria-labelledby="banner-management-title">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <SimpleSubHeader
            title="배너 관리"
            description={`총 ${totalCount}건 | 노출 ${activeCount}건`}
          />
          <span id="banner-management-title" className="sr-only">
            배너 관리
          </span>
        </div>

        <Link
          href="/csadmin/banner/new"
          className="flex h-[40px] shrink-0 items-center rounded-[10px] bg-[#639E9B] px-4 text-[14px] font-semibold text-white transition hover:bg-[#4E8784]"
        >
          배너 등록
        </Link>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <BannerToolbar
        searchKeyword={searchKeyword}
        visibilityFilter={visibilityFilter}
        onSearchKeywordChange={setSearchKeyword}
        onVisibilityFilterChange={setVisibilityFilter}
      />

      {isLoading ? (
        <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
          배너 목록을 불러오는 중입니다...
        </section>
      ) : filteredBanners.length > 0 ? (
        <section aria-label="배너 목록" className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredBanners.map((banner) => (
            <BannerCard
              key={banner.bannerId}
              banner={banner}
              onDelete={openDeleteModal}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
          조건에 맞는 배너가 없습니다.
        </section>
      )}

      <Modal
        open={Boolean(deleteTargetId)}
        title="배너 삭제"
        description="배너를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={deleteBanner}
        onCancel={closeDeleteModal}
      />

      <CompleteModal
        open={Boolean(message)}
        title="알림"
        description={message}
        buttonText="확인"
        onConfirm={() => setMessage("")}
      />
    </main>
  );
}
