"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import CouponItem from "@/features/contentmanage/coupon/CouponItem";

import {
  coupons,
} from "@/features/contentmanage/MockData";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

export default function CouponPage() {

  const router = useRouter();
  // 현재 페이지
  const [currentPage, setCurrentPage] =useState(1);
  // 페이지당 개수
  const ITEMS_PER_PAGE = 10;
  // 전체 페이지 수
  const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);
  // 현재 페이지 데이터
  const currentCoupons =coupons.slice((currentPage - 1) * ITEMS_PER_PAGE,currentPage *ITEMS_PER_PAGE);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
       <SimpleSubHeader
            title="쿠폰 관리"
            description="수료 시 발급되는 쿠폰을 등록하고 관리합니다"
        />

      {/* 검색 영역 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          {/* 왼쪽 */}
          <div className="flex flex-1 gap-3">
            {/* 검색 */}
            <div className="flex h-[42px] flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
              <img
                src="/images/search.svg"
                alt="검색"
                className="h-[16px] w-[16px]"
              />
              <input
                type="text"
                placeholder="쿠폰명 검색..."
                className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />
            </div>
            {/* 상태 선택 */}
            <select className="h-[42px] w-[140px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none">
              <option>전체</option>
              <option>사용가능</option>
              <option>사용불가</option>
            </select>
          </div>

          {/* 버튼 */}
          <Link
            href="/contentadmin/coupon/new"
            className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            + 쿠폰 등록
          </Link>
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">

        {/* 헤더 */}
        <div className="grid grid-cols-[2fr_0.7fr_1fr_1.5fr_0.8fr_0.8fr_0.8fr_0.7fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
          <div>쿠폰명</div>
          <div>할인율</div>
          <div>유효기간</div>
          <div>연결 강의</div>
          <div>적용 대상</div>
          <div>상태</div>
          <div>등록일</div>
          <div className="text-center">
            액션
          </div>
        </div>

        {/* 리스트 */}
        {currentCoupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            name={coupon.name}
            discount={coupon.discount}
            startDate={coupon.startDate}
            endDate={coupon.endDate}
            lecture={coupon.lecture}
            target={coupon.target}
            isActive={coupon.isActive}
            createdAt={coupon.createdAt}
            onEdit={() =>
              router.push(
                `/contentadmin/coupon/${coupon.id}/edit`
              )
            }
            onDelete={() => {
              setSelectedCouponId(
                coupon.id
              );
              setOpenDeleteModal(true);
            }}
          />
        ))}

        {/* 하단 */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[14px] text-[#667085]">
            총 {coupons.length}개의 쿠폰
          </p>
          {/* 페이지네이션 */}
          <div className="flex items-center gap-2">
            {/* 이전 */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }

              disabled={currentPage === 1}
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              이전
            </button>

            {/* 페이지 번호 */}
            {Array.from({
              length: totalPages,
            }).map((_, index) => {

              const page =
                index + 1;

              return (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }

                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[14px] font-semibold ${
                    currentPage === page
                      ? "bg-[#439A97] text-white"
                      : "border border-[#E4E7EC] bg-white text-[#667085]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* 다음 */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </div>
      {/* 삭제 확인 */}
      <Modal
        open={openDeleteModal}
        title="쿠폰 삭제"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          console.log(
            "삭제 쿠폰:",
            selectedCouponId
          );
          // TODO:
          // 나중에 API 연결
          setOpenDeleteModal(false);
          setOpenDeleteCompleteModal(true);
        }}
        onCancel={() =>
          setOpenDeleteModal(false)
        }
      />
      {/* 삭제 완료 */}
        <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="쿠폰이 삭제되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenDeleteCompleteModal(false)
        }
      />
    </div>
  );
}