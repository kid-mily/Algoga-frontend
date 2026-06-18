import { MyCoupon } from "./types";

interface CouponCardProps {
  coupon: MyCoupon;
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "-";
  }

  return dateString.split("T")[0].replaceAll("-", ".");
}

function getDiscountText(coupon: MyCoupon) {
  if (coupon.discountType === "RATE") {
    return `${coupon.discountValue}%`;
  }

  return `${formatNumber(coupon.discountValue)}원`;
}

function getStatusText(coupon: MyCoupon) {
  if (coupon.usable) {
    return "사용 가능";
  }

  if (coupon.status === "USED") {
    return "사용 완료";
  }

  if (coupon.status === "EXPIRED") {
    return "기간 만료";
  }

  return "사용 불가";
}

export default function CouponCard({
  coupon,
}: CouponCardProps) {
  return (
    <article
      className={`relative min-h-[170px] overflow-hidden rounded-2xl border p-6 shadow-lg ${
        coupon.usable
          ? "border-[#4F8D89] bg-[#5F9C98] text-white"
          : "border-gray-300 bg-gray-200 text-gray-600"
      }`}
    >

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <p
            className={`truncate text-sm font-semibold ${
              coupon.usable ? "text-white" : "text-gray-700"
            }`}
          >
            {coupon.couponName}
          </p>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              coupon.usable
                ? "bg-white/20 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            {getStatusText(coupon)}
          </span>
        </div>

        <p
          className={`mt-3 text-4xl font-bold ${
            coupon.usable ? "text-white" : "text-gray-700"
          }`}
        >
          {getDiscountText(coupon)}
        </p>

        <p
          className={`mt-4 truncate text-sm ${
            coupon.usable ? "text-white/90" : "text-gray-600"
          }`}
        >
          {coupon.courseTitle || "전체 강의"}
        </p>

        <p
          className={`mt-3 text-xs ${
            coupon.usable ? "text-white/80" : "text-gray-500"
          }`}
        >
          유효기간: {formatDate(coupon.expiredAt)}
        </p>
      </div>
    </article>
  );
}