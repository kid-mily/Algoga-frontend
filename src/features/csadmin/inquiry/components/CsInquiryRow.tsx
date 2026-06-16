import Link from "next/link";
import { CsInquiry, CsInquiryType } from "../types";

type CsInquiryRowProps = {
  inquiry: CsInquiry;
};

const typeStyle: Record<CsInquiryType, string> = {
  예약: "bg-[#DCFCE7] text-[#16A34A]",
  환불: "bg-[#FEE2E2] text-[#DC2626]",
  강의: "bg-[#DBEAFE] text-[#2563EB]",
  기타: "bg-[#F2F4F7] text-[#667085]",
};

export default function CsInquiryRow({ inquiry }: CsInquiryRowProps) {
  const isPending = inquiry.status === "미처리";

  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-6 py-5">{inquiry.id}</td>
      <td className="px-6 py-5 font-semibold">{inquiry.writer}</td>
      <td className="px-6 py-5">
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-bold ${typeStyle[inquiry.type]}`}
        >
          {inquiry.type}
        </span>
      </td>
      <td className="px-6 py-5 font-semibold text-[#111827]">
        <Link
          href={`/csadmin/inquiry/${inquiry.inquiryId}`}
          className="block truncate hover:text-[#439A97]"
        >
          {inquiry.title}
        </Link>
      </td>
      <td className="px-6 py-5 text-[#667085]">{inquiry.date}</td>
      <td className="px-6 py-5">
        <span
          className={`flex items-center gap-1 font-semibold ${
            isPending ? "text-[#F97316]" : "text-[#22C55E]"
          }`}
        >
          <img
            src={isPending ? "/images/Timer.svg" : "/images/check-circle.svg"}
            alt=""
            aria-hidden="true"
            className="h-[16px] w-[16px]"
          />
          {inquiry.status}
        </span>
      </td>
    </tr>
  );
}
