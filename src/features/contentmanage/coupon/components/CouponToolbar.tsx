import Link from "next/link";
import { CouponStatusFilter, CouponToolbarProps } from "../types";

export default function CouponToolbar({
  searchTerm,
  statusFilter,
  onSearchTermChange,
  onStatusFilterChange,
}: CouponToolbarProps) {
  return (
    <form
      role="search"
      aria-label="쿠폰 검색 및 필터"
      className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <fieldset className="flex items-center justify-between gap-3">
        <legend className="sr-only">쿠폰 검색 조건</legend>
        <section className="flex min-w-0 flex-1 gap-3" aria-label="쿠폰 검색 입력">
          <label
            htmlFor="coupon-search"
            className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3"
          >
            <img src="/images/search.svg" alt="" aria-hidden="true" className="h-[16px] w-[16px]" />
            <span className="sr-only">쿠폰명 검색</span>
            <input
              id="coupon-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="쿠폰명 검색"
              className="ml-2 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>

          <label htmlFor="coupon-status-filter" className="sr-only">쿠폰 상태 필터</label>
          <select
            id="coupon-status-filter"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as CouponStatusFilter)
            }
            className="h-[42px] w-[140px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          >
            <option value="all">전체</option>
            <option value="active">사용가능</option>
            <option value="inactive">사용불가</option>
          </select>
        </section>

        <Link
          href="/contentadmin/coupon/new"
          className="flex h-[42px] shrink-0 items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
        >
          + 쿠폰 등록
        </Link>
      </fieldset>
    </form>
  );
}
