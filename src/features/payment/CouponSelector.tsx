import { MyCoupon } from "../mypage/benefits/components/types";

interface Props {
    coupons: MyCoupon[];
    selectedCouponId: number | null;
    onChange: (couponId: number | null) => void;
}

export default function CouponSelector({ coupons, selectedCouponId, onChange }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            <div className="flex items-center">
                <img src="/images/UserCoupon.svg" alt="쿠폰" />
                <h1 className="ml-2 font-bold">할인 쿠폰</h1>
            </div>

            {/* 쿠폰 선택 */}
            <div className="mt-5">
                <select
                    value={selectedCouponId ?? ""}
                    onChange={(event) =>
                    onChange(
                        event.target.value
                        ? Number(event.target.value)
                        : null
                    )}
                    className="mt-3 h-[48px] w-full rounded-[12px] border border-[#E4E7EC] px-4 outline-none"
                >
                    <option value="">쿠폰 선택 안 함</option>
                    
                    {coupons.map((coupon) => (
                        <option
                            key={coupon.userCouponId}
                            value={coupon.userCouponId}
                        >
                            {coupon.couponName}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* 경고 안내 */}
            <div className="mt-4 bg-[#FFF8E8] border border-[#F6C453] rounded-2xl px-4 py-3 text-sm text-[#D48806]">
                ⚠ 환불 시 쿠폰은 재발급되지 않습니다
            </div>
        </div>
    );
}