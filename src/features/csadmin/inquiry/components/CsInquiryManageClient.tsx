"use client";

import { CsInquiry } from "../types";
import { useCsInquiryList } from "../hooks/useCsInquiryList";
import CsInquiryPagination from "./CsInquiryPagination";
import CsInquiryTable from "./CsInquiryTable";
import CsInquiryToolbar from "./CsInquiryToolbar";

type CsInquiryManageClientProps = {
  initialInquiries: CsInquiry[];
};

export default function CsInquiryManageClient({
  initialInquiries,
}: CsInquiryManageClientProps) {
  const {
    searchKeyword,
    selectedCategory,
    selectedStatus,
    filteredInquiries,
    totalCount,
    pendingCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedCategory,
    setSelectedStatus,
    setCurrentPage,
  } = useCsInquiryList(initialInquiries);

  return (
    <main aria-labelledby="cs-inquiry-management-title">
      <header className="mb-6">
        <h1
          id="cs-inquiry-management-title"
          className="text-[26px] font-bold text-[#111827]"
        >
          고객 문의 관리
        </h1>

        <p className="mt-2 text-[14px] text-[#667085]">
          총 {totalCount}건 | 미처리{" "}
          <span className="font-bold text-[#EF4444]">{pendingCount}건</span>
        </p>
      </header>

      <CsInquiryToolbar
        searchKeyword={searchKeyword}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedCategoryChange={setSelectedCategory}
        onSelectedStatusChange={setSelectedStatus}
      />

      {error && (
        <section
          role="alert"
          className="mb-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]"
        >
          {error}
        </section>
      )}

      <CsInquiryTable inquiries={filteredInquiries} isLoading={isLoading} />
      <CsInquiryPagination
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
