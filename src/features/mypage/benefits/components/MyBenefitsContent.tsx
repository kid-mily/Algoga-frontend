import Link from "next/link";
import CouponCarousel from "./CouponCarousel";
import { MileageSummaryCard } from "./MileageSummaryCard";
import { MileageHistoryTable } from "./MileageHistoryTable";
import { MyCoupon, MyMileage } from "./types";

interface MyBenefitsContentProps {
  coupons: MyCoupon[];
  mileage: MyMileage;
}

export default function MyBenefitsContent({
  coupons,
  mileage,
}: MyBenefitsContentProps) {
  const usableCouponCount = coupons.filter(
    (coupon) => coupon.usable
  ).length;

  return (
    <div className="w-full">
      <section aria-labelledby="coupon-title">
        <div className="mb-5 flex items-center justify-between">
          <h1
            id="coupon-title"
            className="text-xl font-bold text-[#0A1628]"
          >
            쿠폰함
          </h1>

          <div className="flex items-center gap-3">
            <p className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#439A97] shadow-sm">
              사용 가능 {usableCouponCount}개
            </p>

            <Link
              href="/mypage/benefits/coupons"
              className="text-sm font-semibold text-[#439A97] hover:underline"
            >
              자세히 보기
            </Link>
          </div>
        </div>

        {coupons.length === 0 ? (
          <EmptyBox message="보유한 쿠폰이 없습니다." />
        ) : (
          <CouponCarousel coupons={coupons} />
        )}
      </section>

      <section
        aria-labelledby="mileage-title"
        className="mt-12"
      >
        <h2
          id="mileage-title"
          className="mb-5 text-xl font-bold text-[#0A1628]"
        >
          마일리지
        </h2>

        <div className="space-y-4">
          <MileageSummaryCard mileage={mileage} />

          <MileageHistoryTable
            histories={mileage.histories ?? []}
            limit={3}
            moreHref="/mypage/benefits/mileages"
          />
        </div>
      </section>
    </div>
  );
}

interface EmptyBoxProps {
  message: string;
}

function EmptyBox({ message }: EmptyBoxProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {message}
      </p>
    </div>
  );
}
