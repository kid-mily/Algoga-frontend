import {
  csInquiryCategoryFilters,
  csInquiryStatusFilters,
  CsInquiryCategoryFilter,
  CsInquiryStatusFilter,
} from "../types";

type CsInquiryToolbarProps = {
  searchKeyword: string;
  selectedCategory: CsInquiryCategoryFilter;
  selectedStatus: CsInquiryStatusFilter;
  onSearchKeywordChange: (value: string) => void;
  onSelectedCategoryChange: (value: CsInquiryCategoryFilter) => void;
  onSelectedStatusChange: (value: CsInquiryStatusFilter) => void;
};

export default function CsInquiryToolbar({
  searchKeyword,
  selectedCategory,
  selectedStatus,
  onSearchKeywordChange,
  onSelectedCategoryChange,
  onSelectedStatusChange,
}: CsInquiryToolbarProps) {
  return (
    <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="고객 문의 검색 및 필터"
        className="flex items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex h-[44px] min-w-0 flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
          <img
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px]"
          />
          <label htmlFor="cs-inquiry-search" className="sr-only">
            문의 제목 또는 작성자 검색
          </label>
          <input
            id="cs-inquiry-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="제목 또는 작성자 검색..."
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        <label className="sr-only" htmlFor="cs-inquiry-category">
          문의 유형
        </label>
        <select
          id="cs-inquiry-category"
          value={selectedCategory}
          onChange={(event) =>
            onSelectedCategoryChange(event.target.value as CsInquiryCategoryFilter)
          }
          className="h-[44px] w-[140px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] outline-none"
        >
          {csInquiryCategoryFilters.map((category) => (
            <option key={category.code} value={category.code}>
              {category.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="cs-inquiry-status">
          처리 상태
        </label>
        <select
          id="cs-inquiry-status"
          value={selectedStatus}
          onChange={(event) =>
            onSelectedStatusChange(event.target.value as CsInquiryStatusFilter)
          }
          className="h-[44px] w-[140px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-semibold text-[#344054] outline-none"
        >
          {csInquiryStatusFilters.map((status) => (
            <option key={status.code} value={status.code}>
              {status.label}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
