// 쿠폰 목록 클라이언트

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import AdminLoadingState from "@/features/admin/common/AdminLoadingState";
import Modal from "@/features/common/components/Modal";
import CompleteModal from "@/features/common/components/CompleteModal";
import CouponToolbar from "./CouponToolbar";
import CouponTable from "./CouponTable";
import CouponPagination from "./CouponPagination";
import { deleteCouponAction } from "../actions";
import { CouponStatusFilter, CouponWithLecture } from "../types";
import { filterCoupons, getCouponCourseId, getCouponId } from "../utils/couponFormatters";
import { useAdminCouponList } from "../hooks/useAdminCouponList";

const ITEMS_PER_PAGE = 10;

export default function CouponManageClient() {
  const router = useRouter();
  const { coupons, isLoading, errorMessage, refetch } = useAdminCouponList();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithLecture | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  //쿠폰 목록이 바뀌거나, 검색어가 바뀌거나, 상태 필터가 바뀔 때만 다시 필터링
  const filteredCoupons = useMemo(
    () => filterCoupons(coupons, searchTerm, statusFilter),
    [coupons, searchTerm, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE));
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetPage = () => setCurrentPage(1);

  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;

    try {
      // 백엔드 API
      const deleteCourseId = getCouponCourseId(selectedCoupon); 
      const deleteCouponPolicyId = getCouponId(selectedCoupon);

      setActionError("");
      await deleteCouponAction(
        deleteCourseId,
        deleteCouponPolicyId
      );
      setDeleteModalOpen(false);
      setCompleteModalOpen(true);
      setSelectedCoupon(null);
      await refetch();
    } catch (error: unknown) {
      setDeleteModalOpen(false);
      setActionError(
        error instanceof Error ? error.message : "쿠폰 삭제에 실패했습니다."
      );
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="쿠폰 목록을 불러오는 중입니다." />;
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="coupon-management-title">
      <section aria-labelledby="coupon-management-title">
        <SimpleSubHeader
          title="쿠폰 관리"
          description="수료 후 발급되는 쿠폰을 등록하고 관리합니다."
        />
      </section>

      <AdminErrorBanner message={errorMessage || actionError} />

      <section aria-label="쿠폰 검색 및 필터 영역">
        <CouponToolbar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={(value) => {
            setSearchTerm(value);
            resetPage();
          }}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            resetPage();
          }}
        />
      </section>

      <section aria-labelledby="coupon-list-title">
        <h2 id="coupon-list-title" className="sr-only">쿠폰 목록</h2>
        <CouponTable
          coupons={currentCoupons}
          totalCount={filteredCoupons.length}
          onEdit={(coupon) =>
            router.push(
              `/contentadmin/coupon/${getCouponId(coupon)}/edit?courseId=${getCouponCourseId(coupon)}`
            )
          }
          onDelete={(coupon) => {
            setSelectedCoupon(coupon);
            setDeleteModalOpen(true);
          }}
        >
          <CouponPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CouponTable>
      </section>

      <Modal
        open={deleteModalOpen}
        title="쿠폰 삭제"
        description="정말 이 쿠폰을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCoupon(null);
        }}
      />

      <CompleteModal
        open={completeModalOpen}
        title="삭제 완료"
        description="쿠폰이 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setCompleteModalOpen(false)}
      />
    </main>
  );
}

