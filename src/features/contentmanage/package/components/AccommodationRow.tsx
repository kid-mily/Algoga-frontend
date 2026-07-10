import Image from "next/image";
import { Accommodation } from "../types";

interface AccommodationRowProps {
  accommodation: Accommodation;
  onEdit: (accommodationId: number) => void;
  onDelete: (accommodation: Accommodation) => void;
}

const isAllowedImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return false;
  if (imageUrl.startsWith("/")) return true;

  try {
    const url = new URL(imageUrl);

    return url.hostname === "algoga-bucket.kro.kr";
  } catch {
    return false;
  }
};

export default function AccommodationRow({
  accommodation,
  onEdit,
  onDelete,
}: AccommodationRowProps) {
  const canRenderAccommodationImage = isAllowedImageUrl(accommodation.imageUrl);

  return (
    <tr className="border-b border-[#E4E7EC]">
      <td className="px-5 py-5">
        <section className="flex items-center gap-3">
          <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#F2F4F7]">
            {canRenderAccommodationImage ? (
              <Image
                src={accommodation.imageUrl || "/images/hotel.svg"}
                alt={`${accommodation.name} 숙소 이미지`}
                width={44}
                height={44}
                sizes="44px"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/images/hotel.svg"
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                className="h-[20px] w-[20px]"
              />
            )}
          </span>
          <section className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#111827]">
              {accommodation.name}
            </p>
            <p className="mt-1 truncate text-[13px] text-[#98A2B3]">
              {accommodation.address || "주소 미등록"}
            </p>
          </section>
        </section>
      </td>
      <td className="px-5 py-5 text-[14px] text-[#344054]">
        <p className="line-clamp-2">{accommodation.description || "-"}</p>
      </td>
      <td className="px-5 py-5 text-[16px] font-bold text-[#111827]">
        {accommodation.pricePerNight.toLocaleString()}원
      </td>
      <td className="px-5 py-5">
        <menu className="flex items-center justify-center gap-3">
          <li>
            <button
              type="button"
              onClick={() => onEdit(accommodation.accommodationId)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
              aria-label={`${accommodation.name} 수정`}
            >
              <Image src="/images/edit.svg" alt="" width={16} height={16} />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onDelete(accommodation)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] transition hover:bg-[#FEF2F2]"
              aria-label={`${accommodation.name} 삭제`}
            >
              <Image src="/images/delete.svg" alt="" width={16} height={16} />
            </button>
          </li>
        </menu>
      </td>
    </tr>
  );
}
