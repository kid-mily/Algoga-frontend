import CouponRow from "./CouponRow";
import { CouponTableProps } from "../types";

export default function CouponTable({
  coupons,
  totalCount,
  onEdit,
  onDelete,
  children,
}: CouponTableProps) {
  return (
    <section className="mt-5 w-full max-w-full overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">쿠폰 목록</caption>
        <colgroup>
          <col className="w-[18%]" />
          <col className="w-[9%]" />
          <col className="w-[11%]" />
          <col className="w-[22%]" />
          <col className="w-[11%]" />
          <col className="w-[9%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#FCFCFD] text-[12px] font-semibold text-[#667085]">
            <th scope="col" className="px-3 py-4 text-left">
              쿠폰명
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              할인
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              유효기간
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              연결 강의
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              적용 대상
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              상태
            </th>
            <th scope="col" className="px-3 py-4 text-left">
              등록일
            </th>
            <th scope="col" className="px-3 py-4 text-center">
              관리
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="h-[200px] px-3 py-5 text-center text-[14px] text-[#98A2B3]"
              >
                등록된 쿠폰이 없습니다.
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
              <CouponRow
                key={`${coupon.courseId}-${coupon.couponPolicyId || coupon.id}`}
                coupon={coupon}
                onEdit={() => onEdit(coupon)}
                onDelete={() => onDelete(coupon)}
              />
            ))
          )}
        </tbody>
      </table>

      <footer className="flex items-center justify-between gap-3 border-t border-[#E4E7EC] px-4 py-4">
        <p className="shrink-0 text-[13px] text-[#667085]">
          총 {totalCount}개의 쿠폰
        </p>
        <section className="min-w-0" aria-label="쿠폰 페이지 이동">
          {children}
        </section>
      </footer>
    </section>
  );
}
