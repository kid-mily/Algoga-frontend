"use client";

import Link from "next/link";
import { useState } from "react";

import PackageCard from "@/features/contentmanage/package/PackageCard";
import { packages } from "@/features/contentmanage/MockData";
import { useRouter } from "next/navigation";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

export default function PackagePage() {

  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SimpleSubHeader
        title="패키지 관리"
        description="항공권과 숙소가 포함된 여행 패키지를 등록하고 관리합니다"
      />

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
                placeholder="패키지명 또는 목적지 검색..."
                className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            {/* select */}
            <select className="h-[42px] w-[140px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none">

              <option>전체</option>
              <option>활성</option>
              <option>비활성</option>
            </select>
          </div>

          {/* 등록 버튼 */}
          <Link
            href="/contentadmin/package/new"
            className="flex h-[52px] items-center rounded-[16px] bg-[#439A97] px-6 text-[15px] font-semibold text-white transition hover:opacity-90"
          >
            + 패키지 등록
          </Link>
        </div>
      </div>

      {/* 리스트 */}
      <div className="mt-6 space-y-6">

        {packages.map((item) => (

          <PackageCard
            key={item.id}
            title={item.title}
            description={item.description}
            location={item.location}
            duration={item.duration}
            lecture={item.lecture}
            active={item.active}
            originalPrice={item.originalPrice}
            discountPercent={item.discountPercent}
            finalPrice={item.finalPrice}
            flight={item.flight}
            hotel={item.hotel}

            onEdit={() =>
              router.push(
                `/contentadmin/package/${item.id}/edit`
              )
            }
            onDelete={() => {
              setSelectedPackageId(item.id);
              setOpenDeleteModal(true);
            }}
          />
        ))}
      </div>

      {/* 삭제 확인 */}
      <Modal
        open={openDeleteModal}
        title="패키지 삭제"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {

          console.log(
            "삭제 패키지:",
            selectedPackageId
          );

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
        description="패키지가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenDeleteCompleteModal(false)
        }
      />
    </div>
  );
}