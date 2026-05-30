"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import Modal from "@/features/common/Modal";
import CompleteModal from "@/features/common/CompleteModal";

import { getAdminCoupons, deleteAdminCoupon} from "@/features/services/adminCoupon.service";
import { getAdminCourses } from "@/features/services/adminCourse.service"; 
import { AdminCoupon } from "../../../features/contentmanage/types";

export default function CouponPage() {
  const router = useRouter();
  
  const [searchCourseId, setSearchCourseId] = useState("");
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [courses, setCourses] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [targetCoupon, setTargetCoupon] = useState<{ courseId: number; policyId: number } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAdminCourses();
        setCourses(data);
      } catch (error) {
        console.error("강의 목록을 불러오지 못했습니다.", error);
      }
    };
    fetchCourses();
  }, []);

  const getCourseTitle = (courseId: number) => {
    const course = courses.find((c) => (c.courseId || c.course_id || c.id) === courseId);
    return course ? course.title : `알 수 없는 강의 (ID: ${courseId})`;
  };

  const handleSearch = async () => {
    if (!searchCourseId) return;
    
    try {
      setIsLoading(true);
      const data = await getAdminCoupons(Number(searchCourseId));
      setCoupons(data);
    } catch (error) {
      console.error("목록 조회 실패:", error);
      setCoupons([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!targetCoupon) return;
    try {
      await deleteAdminCoupon(targetCoupon.courseId, targetCoupon.policyId);
      setCoupons((prev) => prev.filter((c) => c.couponPolicyId !== targetCoupon.policyId));
      setDeleteModalOpen(false);
      setCompleteModalOpen(true);
      setTargetCoupon(null);
    } catch (error) {
      console.error("삭제 실패:", error);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      <SimpleSubHeader title="쿠폰 관리" description="강의별 수료/할인 쿠폰 정책을 관리합니다" />

      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <select
            value={searchCourseId}
            onChange={(e) => setSearchCourseId(e.target.value)}
            className="h-[42px] w-[280px] rounded-[12px] border border-[#E4E7EC] px-3 text-[13px] outline-none focus:border-[#439A97]"
          >
            <option value="">조회할 강의를 선택하세요</option>
            {courses.map((course) => {
              const id = course.courseId || course.course_id || course.id;
              return (
                <option key={id} value={id}>
                  {course.title}
                </option>
              );
            })}
          </select>

          <button 
            onClick={handleSearch}
            className="h-[42px] rounded-[12px] bg-[#111827] px-4 text-[13px] font-semibold text-white hover:opacity-90"
          >
            목록 조회
          </button>
        </div>

        <Link
          href="/contentadmin/coupon/new"
          className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + 새 쿠폰 등록
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
        <div className="grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-center text-[13px] font-semibold text-[#667085]">
          <div>쿠폰 ID</div>
          <div className="text-left pl-2">연결된 강의명</div>
          <div className="text-left">쿠폰 이름</div>
          <div>할인 혜택</div>
          <div>유효 기간</div>
          <div>상태</div>
          <div>관리</div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-[14px] text-[#667085]">조회 중입니다...</div>
        ) : coupons.length === 0 ? (
          <div className="p-10 text-center text-[14px] text-[#667085]">
            강의를 선택하고 '목록 조회'를 눌러주세요.
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.couponPolicyId} className="grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr_1fr] items-center border-b border-[#E4E7EC] px-5 py-4 text-center text-[14px] text-[#111827]">
              <div>{coupon.couponPolicyId}</div>
              <div className="text-left pl-2 truncate pr-4 text-[#667085] text-[13px]">
                {getCourseTitle(coupon.courseId)}
              </div>
              <div className="text-left font-medium truncate">{coupon.couponName}</div>
              <div className="font-semibold text-[#439A97]">
                {coupon.discountValue}{coupon.discountType === "RATE" ? "%" : "원"}
              </div>
              <div>{coupon.validDays}일</div>
              
              <div className="flex justify-center">
                <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                  coupon.active ? "bg-[#EAF7EE] text-[#43A047]" : "bg-[#F2F4F7] text-[#667085]"
                }`}>
                  {coupon.active ? "활성" : "비활성"}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => router.push(`/contentadmin/coupon/${coupon.couponPolicyId}/edit?courseId=${coupon.courseId}`)} 
                  className="text-[13px] font-semibold text-[#439A97] hover:underline"
                >
                  수정
                </button>
                <button 
                  onClick={() => { 
                    setTargetCoupon({ courseId: coupon.courseId, policyId: coupon.couponPolicyId }); 
                    setDeleteModalOpen(true); 
                  }} 
                  className="text-[13px] font-semibold text-[#DC2626] hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={deleteModalOpen} title="쿠폰 삭제" description="정말 이 쿠폰 정책을 삭제하시겠습니까?" confirmText="삭제" cancelText="취소" onConfirm={handleDeleteConfirm} onCancel={() => { setDeleteModalOpen(false); setTargetCoupon(null); }} />
      <CompleteModal open={completeModalOpen} title="삭제 완료" description="쿠폰이 성공적으로 삭제되었습니다." buttonText="확인" onConfirm={() => setCompleteModalOpen(false)} />
    </div>
  );
}