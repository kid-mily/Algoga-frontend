"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SubHeader from "@/features/common/components/SubHeader";
import {
  ALL_COUNTRIES_ID,
  useAdminAccommodationList,
} from "../hooks/useAdminAccommodationList";
import { Accommodation } from "../types";
import AccommodationTable from "./AccommodationTable";

export default function AccommodationManageClient() {
  const router = useRouter();
  const {
    countries,
    selectedCountryId,
    accommodations,
    isLoading,
    error,
    setSelectedCountryId,
    removeAccommodation,
  } = useAdminAccommodationList();
  const [deleteTarget, setDeleteTarget] = useState<Accommodation | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const success = await removeAccommodation(deleteTarget.accommodationId);
    setDeleteTarget(null);

    if (success) {
      setCompleteOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 관리로 돌아가기"
        title="숙소 관리"
        description="패키지 구성에 사용할 숙소를 국가별로 관리합니다"
      />

      <section className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <section className="flex items-center justify-between gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 text-[14px] font-semibold text-[#344054]">
              국가
            </span>
            <select
              value={selectedCountryId}
              onChange={(event) => setSelectedCountryId(event.target.value)}
              className="h-[42px] min-w-0 flex-1 rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
            >
              {countries.length === 0 ? (
                <option value="">국가 없음</option>
              ) : (
                <>
                  <option value={ALL_COUNTRIES_ID}>전체</option>
                  {countries.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>

          <Link
            href="/contentadmin/accommodations/new"
            className="flex h-[42px] items-center rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            + 숙소 등록
          </Link>
        </section>
      </section>

      <AdminErrorBanner message={error} className="mt-4" />

      <AccommodationTable
        accommodations={accommodations}
        isLoading={isLoading}
        onEdit={(accommodationId) =>
          router.push(`/contentadmin/accommodations/${accommodationId}/edit`)
        }
        onDelete={setDeleteTarget}
      />

      <Modal
        open={Boolean(deleteTarget)}
        title="숙소 삭제"
        description={`${deleteTarget?.name || "선택한 숙소"}를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CompleteModal
        open={completeOpen}
        title="삭제 완료"
        description="숙소가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setCompleteOpen(false)}
      />
    </main>
  );
}
