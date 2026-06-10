import { CouponRowProps } from "../types";
import {
  formatDate,
  formatDiscount,
  formatValidDays,
  getCouponName,
  getIsCouponActive,
} from "../utils/couponFormatters";

export default function CouponRow({
  coupon,
  onEdit,
  onDelete,
}: CouponRowProps) {
  const couponName = getCouponName(coupon);
  const isActive = getIsCouponActive(coupon);

  return (
    <tr className="border-b border-[#E4E7EC] text-[13px] text-[#111827]">
      <th scope="row" className="px-3 py-4 text-left align-middle">
        <span className="block truncate text-[14px] font-semibold">
          {couponName}
        </span>
      </th>

      <td className="px-3 py-4 align-middle">
        <span className="inline-flex max-w-full truncate rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[12px] font-bold text-[#43A047]">
          {formatDiscount(coupon)}
        </span>
      </td>

      <td className="px-3 py-4 align-middle text-[12px] text-[#667085]">
        <p className="truncate">발급일 기준</p>
        <p className="truncate">~ {formatValidDays(coupon.validDays)}</p>
      </td>

      <td className="px-3 py-4 align-middle">
        <span className="block truncate font-medium">
          {coupon.lectureName || "-"}
        </span>
      </td>

      <td className="px-3 py-4 align-middle">
        <span className="inline-flex max-w-full truncate rounded-[10px] bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-semibold text-[#667085]">
          전체 수강생
        </span>
      </td>

      <td className="px-3 py-4 align-middle">
        <span
          className={`inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-[12px] font-semibold ${
            isActive
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {isActive ? "사용가능" : "사용불가"}
        </span>
      </td>

      <td className="px-3 py-4 align-middle text-[12px] text-[#667085]">
        <span className="block truncate">{formatDate(coupon.createdAt)}</span>
      </td>

      <td className="px-3 py-4 align-middle">
        <menu
          className="flex items-center justify-center gap-2"
          aria-label={`${couponName} 관리`}
        >
          <li>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`${couponName} 수정`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
            >
              <img
                src="/images/edit.svg"
                alt=""
                aria-hidden="true"
                className="h-[17px] w-[17px]"
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`${couponName} 삭제`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
            >
              <img
                src="/images/delete.svg"
                alt=""
                aria-hidden="true"
                className="h-[17px] w-[17px]"
              />
            </button>
          </li>
        </menu>
      </td>
    </tr>
  );
}
