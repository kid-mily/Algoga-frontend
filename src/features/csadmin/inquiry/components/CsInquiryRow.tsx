"use client";

import { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const isPending = inquiry.status === "미처리";
  const detailHref = `/csadmin/inquiry/${inquiry.inquiryId}`;

  const goToDetail = () => {
    router.push(detailHref);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetail();
    }
  };

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={`${inquiry.title} 상세 보기`}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className="cursor-pointer border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0 hover:bg-[#F9FAFB]"
    >
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
        <span className="block truncate">
          {inquiry.title}
        </span>
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
