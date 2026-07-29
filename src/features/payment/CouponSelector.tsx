import { MyCoupon } from "../mypage/benefits/components/types";

interface Props {
  coupons: MyCoupon[];
  selectedCouponId: number | null;
  onChange: (couponId: number | null) => void;
  // 예: 분할결제 1차(예약금)는 쿠폰을 못 쓰고 마일리지만 가능 — 이럴 때 선택창을 잠그고 이유를 보여준다
  disabled?: boolean;
  disabledReason?: string;
}

export default function CouponSelector({
  coupons,
  selectedCouponId,
  onChange,
  disabled = false,
  disabledReason,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
            COUPON
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#0A1628]">할인 쿠폰</h2>
        </div>

        <span className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-bold text-[#357F7C]">
          {coupons.length}개 보유
        </span>
      </div>

      <select
        value={selectedCouponId ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : null)
        }
        className="mt-5 h-14 w-full rounded-2xl border border-[#E1E8EF] bg-[#FAFCFE] px-4 text-sm font-medium text-[#0A1628] outline-none transition focus:border-[#439A97] focus:bg-white disabled:cursor-not-allowed disabled:bg-[#F3F8FC] disabled:text-[#A0AEC0]"
      >
        <option value="">쿠폰 선택 안 함</option>

        {coupons.map((coupon) => (
          <option key={coupon.userCouponId} value={coupon.userCouponId}>
            {coupon.couponName}
          </option>
        ))}
      </select>

      {disabled && disabledReason && (
        <p className="mt-2 text-xs text-[#8A9BB0]">{disabledReason}</p>
      )}
    </section>
  );
}