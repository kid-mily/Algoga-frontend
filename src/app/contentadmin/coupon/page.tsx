"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import CouponItem from "@/features/contentmanage/coupon/CouponItem";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import LoadingSpinner from "@/features/common/LoadingSpinner";

// 🌟 실제 API 연동을 위한 함수 임포트 (MockData 제거)
import { getAdminCourses } from "@/features/services/adminCourse.service";
import { getAdminCoupons, deleteAdminCoupon } from "@/features/services/adminCoupon.service";

export default function CouponPage() {
  const router = useRouter();

  // 🌟 API 연동용 상태
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(couponsList.length / ITEMS_PER_PAGE));
  const currentCoupons = couponsList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // 모달 상태 (🌟 삭제 시 courseId가 필요하므로 객체로 저장)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<{ courseId: number; couponId: number } | null>(null);

  // 🌟 전체 강의를 조회하고, 각 강의의 쿠폰을 모아서 하나의 리스트로 만드는 함수
  const fetchAllCoupons = async () => {
    try {
      setIsLoading(true);
      setApiError("");

      // 1. 전체 강의 목록 가져오기
      const courses = await getAdminCourses();

      // 2. 각 강의마다 쿠폰 목록 가져오기 (병렬 처리)
      const allCouponsNested = await Promise.all(
        courses.map(async (course: any) => {
          const courseId = course.courseId || course.course_id || course.id;
          try {
            const courseCoupons = await getAdminCoupons(courseId);
            // 쿠폰 데이터에 강의 정보를 붙여서 리턴
            return courseCoupons.map((cp: any) => ({
              ...cp,
              courseId: courseId,
              lectureName: course.title || "알 수 없는 강의",
            }));
          } catch (e) {
            // 특정 강의의 쿠폰을 못 불러와도 전체 화면이 터지지 않도록 방어
            return [];
          }
        })
      );

      // 3. 2차원 배열을 1차원으로 합치고 정렬 (최신순)
      const flattenedCoupons = allCouponsNested.flat();
      flattenedCoupons.sort((a, b) => (b.couponPolicyId || b.id || 0) - (a.couponPolicyId || a.id || 0));

      setCouponsList(flattenedCoupons);
    } catch (error: any) {
      setApiError(error.message || "쿠폰 목록을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  // 🌟 쿠폰 삭제 처리 함수
  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;
    try {
      setApiError("");
      await deleteAdminCoupon(selectedCoupon.courseId, selectedCoupon.couponId);
      
      // 화면에서 즉시 제거
      setCouponsList((prev) => prev.filter((c) => (c.couponPolicyId || c.id) !== selectedCoupon.couponId));
      
      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
      setSelectedCoupon(null);
    } catch (error: any) {
      setOpenDeleteModal(false);
      setApiError(error.message || "쿠폰 삭제에 실패했습니다.");
    }
  };

  // 🌟 전체 화면 로딩 스피너
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <LoadingSpinner text="전체 쿠폰 목록을 불러오는 중입니다..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      {/* 헤더 */}
      <SimpleSubHeader title="쿠폰 관리" description="수료 시 발급되는 쿠폰을 등록하고 관리합니다" />

      {/* 🌟 에러 발생 시 박스로 출력 */}
      {apiError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          🚨 {apiError}
        </div>
      )}

      {/* 검색 영역 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-3">
            <div className="flex h-[42px] flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
              <img src="/images/search.svg" alt="검색" className="h-[16px] w-[16px]" />
              <input type="text" placeholder="쿠폰명 검색..." className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]" />
            </div>
            <select className="h-[42px] w-[140px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none">
              <option>전체</option>
              <option>사용가능</option>
              <option>사용불가</option>
            </select>
          </div>
          <Link href="/contentadmin/coupon/new" className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90">
            + 쿠폰 등록
          </Link>
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
        <div className="grid grid-cols-[2fr_0.7fr_1fr_1.5fr_0.8fr_0.8fr_0.8fr_0.7fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
          <div>쿠폰명</div>
          <div>할인율</div>
          <div>유효기간</div>
          <div>연결 강의</div>
          <div>적용 대상</div>
          <div>상태</div>
          <div>등록일</div>
          <div className="text-center">액션</div>
        </div>

        {/* 리스트 */}
        {currentCoupons.length === 0 ? (
          <div className="p-10 text-center text-[#98A2B3]">등록된 쿠폰이 없습니다.</div>
        ) : (
          currentCoupons.map((coupon) => {
            const couponId = coupon.couponPolicyId || coupon.id;
            const isAmount = coupon.discountType === "AMOUNT";
            
            return (
              <CouponItem
                key={`${coupon.courseId}-${couponId}`}
                name={coupon.couponName || coupon.name || "-"}
                // 정액 / 정률에 맞춰 할인 문자열 생성
                discount={isAmount ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 
                startDate="발급일 기준"
                endDate={`${coupon.validDays}일 뒤`}
                lecture={coupon.lectureName}
                target="전체 수강생"
                isActive={coupon.active !== false && String(coupon.active) !== "false"}
                createdAt={coupon.createdAt ? String(coupon.createdAt).substring(0, 10) : "-"}
                
                // 🌟 수정 버튼 클릭 시 courseId를 파라미터로 넘겨줌! (이전 에러 해결의 핵심)
                onEdit={() => router.push(`/contentadmin/coupon/${couponId}/edit?courseId=${coupon.courseId}`)}
                onDelete={() => {
                  setSelectedCoupon({ courseId: coupon.courseId, couponId: couponId });
                  setOpenDeleteModal(true);
                }}
              />
            );
          })
        )}

        {/* 하단 페이지네이션 */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[14px] text-[#667085]">총 {couponsList.length}개의 쿠폰</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40">
              이전
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <button key={page} onClick={() => setCurrentPage(page)} className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[14px] font-semibold ${currentPage === page ? "bg-[#439A97] text-white" : "border border-[#E4E7EC] bg-white text-[#667085]"}`}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40">
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        open={openDeleteModal}
        title="쿠폰 삭제"
        description="정말 이 쿠폰을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedCoupon(null);
        }}
      />

      {/* 삭제 완료 모달 */}
      <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="쿠폰이 정상적으로 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setOpenDeleteCompleteModal(false)}
      />
    </div>
  );
}