"use client";

import Link from "next/link";
import { AdminBanner } from "../types";
import BannerMediaPreview from "./BannerMediaPreview";

type BannerCardProps = {
  banner: AdminBanner;
  onDelete: (bannerId: number) => void;
};

export default function BannerCard({ banner, onDelete }: BannerCardProps) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-[#E4E7EC] bg-white">
      <figure className="relative h-[120px] overflow-hidden bg-[#EAF6EE]">
        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            banner.isVisible ? "bg-[#65C466] text-white" : "bg-[#98A2B3] text-white"
          }`}
        >
          {banner.isVisible ? "노출" : "숨김"}
        </span>
        <BannerMediaPreview
          src={banner.imageUrl}
          fileType={banner.fileType}
          alt={banner.text || "배너 이미지"}
        />
      </figure>

      <div className="p-3">
        <header className="mb-2.5">
          <p className="mb-1 text-[11px] font-semibold text-[#98A2B3]">
            {banner.displayId} · {banner.fileType === "VIDEO" ? "영상" : "이미지"}
          </p>
          <h2 className="line-clamp-2 min-h-[36px] text-[15px] font-bold leading-[1.25] text-[#111827]">
            {banner.text}
          </h2>
        </header>

        <dl className="space-y-1.5 text-[12px] text-[#667085]">
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-[#344054]">연결</dt>
            <dd className="truncate">{banner.linkUrl || "-"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-[#344054]">등록일</dt>
            <dd>
              <time>{banner.createdAt}</time>
            </dd>
          </div>
        </dl>

        <footer className="mt-3 flex items-center justify-between border-t border-[#EEF2F6] pt-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                banner.isVisible ? "bg-[#65C466]" : "bg-[#98A2B3]"
              }`}
            />
            <span
              className={`text-[14px] font-semibold ${
                banner.isVisible ? "text-[#16A34A]" : "text-[#667085]"
              }`}
            >
              {banner.isVisible ? "노출 중" : "숨김"}
            </span>
          </div>

          <nav aria-label={`${banner.displayId} 배너 관리`} className="flex items-center gap-3">
            <Link
              href={`/csadmin/banner/${banner.bannerId}`}
              aria-label={`수정: 배너 ${banner.bannerId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D0D5DD] text-[#639E9B] transition hover:bg-[#F2F4F7]"
            >
              <img src="/images/edit.svg" alt="" aria-hidden="true" className="h-[15px] w-[15px]" />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(banner.bannerId)}
              aria-label={`삭제: 배너 ${banner.bannerId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FECACA] text-[#EF4444] transition hover:bg-[#FEF2F2]"
            >
              <img src="/images/delete.svg" alt="" aria-hidden="true" className="h-[15px] w-[15px]" />
            </button>
          </nav>
        </footer>
      </div>
    </article>
  );
}
