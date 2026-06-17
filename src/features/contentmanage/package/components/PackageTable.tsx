import Link from "next/link";
import Image from "next/image";
import { TravelPackage } from "../types";

type PackageTableProps = {
  packages: TravelPackage[];
  isLoading: boolean;
  onDelete: (item: TravelPackage) => void;
};

const formatWon = (value: number) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;

export default function PackageTable({
  packages,
  isLoading,
  onDelete,
}: PackageTableProps) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#667085]">
            <th className="w-[120px] px-5 py-4">번호</th>
            <th className="px-5 py-4">패키지명</th>
            <th className="w-[150px] px-5 py-4">국가</th>
            <th className="w-[170px] px-5 py-4">숙소</th>
            <th className="w-[170px] px-5 py-4">항공편</th>
            <th className="w-[150px] px-5 py-4">패키지 가격</th>
            <th className="w-[120px] px-5 py-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-[14px] text-[#667085]">
                패키지 목록을 불러오는 중입니다...
              </td>
            </tr>
          ) : packages.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-[14px] text-[#667085]">
                등록된 패키지가 없습니다.
              </td>
            </tr>
          ) : (
            packages.map((item) => (
              <tr
                key={item.packageId}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  PKG{String(item.packageId).padStart(4, "0")}
                </td>
                <td className="px-5 py-4">
                  <p className="line-clamp-1 font-semibold text-[#111827]">
                    {item.name}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[12px] text-[#98A2B3]">
                    {item.description || "설명 없음"}
                  </p>
                </td>
                <td className="px-5 py-4">{item.countryName}</td>
                <td className="px-5 py-4">
                  <p className="line-clamp-1">{item.accommodationName}</p>
                </td>
                <td className="px-5 py-4">
                  {item.hasFlightInfo ? (
                    <>
                      <p className="font-semibold">
                        {item.departure} → {item.arrival}
                      </p>
                      <p className="mt-1 text-[12px] text-[#98A2B3]">
                        {item.airline} {item.flightNumber}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-[#98A2B3]">
                        항공편 조회 불가
                      </p>
                      <p className="mt-1 text-[12px] text-[#98A2B3]">
                        외부 API 상태를 확인해주세요.
                      </p>
                    </>
                  )}
                </td>
                <td className="px-5 py-4 font-bold text-[#111827]">
                  {formatWon(item.price)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/contentadmin/package/${item.packageId}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
                      aria-label={`${item.name} 수정`}
                    >
                      <Image src="/images/edit.svg" alt="" width={16} height={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] transition hover:bg-[#FEF2F2]"
                      aria-label={`${item.name} 삭제`}
                    >
                      <Image src="/images/delete.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
