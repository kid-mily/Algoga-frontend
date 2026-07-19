"use client";

import { useState } from "react";
import CouponCard from "./CouponCard";
import { MyCoupon } from "./types";

interface CouponCarouselProps {
  coupons: MyCoupon[];
}

const PAGE_SIZE = 3;

export default function CouponCarousel({ coupons }: CouponCarouselProps) {
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(coupons.length / PAGE_SIZE);
  const currentPage = Math.min(page, pageCount - 1);
  const visibleCoupons = coupons.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const goToNext = () =>
    setPage((prev) => Math.min(prev + 1, pageCount - 1));

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentPage === 0}
          aria-label="이전 쿠폰"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          {visibleCoupons.map((coupon) => (
            <CouponCard key={coupon.userCouponId} coupon={coupon} />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentPage >= pageCount - 1}
          aria-label="다음 쿠폰"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>

      {pageCount > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          {currentPage + 1} / {pageCount}
        </p>
      )}
    </div>
  );
}
