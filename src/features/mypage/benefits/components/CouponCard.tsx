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
      className={`relative min-h-[110px] overflow-hidden rounded-xl border p-4 shadow-md ${
        coupon.usable
          ? "border-[#4F8D89] bg-[#5F9C98] text-white"
          : "border-gray-300 bg-gray-200 text-gray-600"
      }`}
    >

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`truncate text-xs font-semibold ${
              coupon.usable ? "text-white" : "text-gray-700"
            }`}
          >
            {coupon.couponName}
          </p>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              coupon.usable
                ? "bg-white/20 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            {getStatusText(coupon)}
          </span>
        </div>

        <p
          className={`mt-2 text-2xl font-bold ${
            coupon.usable ? "text-white" : "text-gray-700"
          }`}
        >
          {getDiscountText(coupon)}
        </p>

        <p
          className={`mt-2 truncate text-xs ${
            coupon.usable ? "text-white/90" : "text-gray-600"
          }`}
        >
          {coupon.courseTitle || "전체 강의"}
        </p>

        <p
          className={`mt-1.5 text-[11px] ${
            coupon.usable ? "text-white/80" : "text-gray-500"
          }`}
        >
          유효기간: {formatDate(coupon.expiredAt)}
        </p>
      </div>
    </article>
  );
}