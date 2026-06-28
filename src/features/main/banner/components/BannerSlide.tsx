import Image from "next/image";
import Link from "next/link";
import type { Banner } from "../types";

interface BannerSlideProps {
  banner: Banner;
  index: number;
  isActive: boolean;
}

export default function BannerSlide({
  banner,
  index,
  isActive,
}: BannerSlideProps) {
  const bannerText = banner.text || "메인 배너";

  return (
    <Link
      href={banner.linkUrl || "/"}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className={`absolute inset-0 block transition-opacity duration-500 ${
        isActive ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <Image
        src={banner.imageUrl}
        alt={bannerText}
        fill
        priority={index === 0}
        sizes="(max-width: 768px) 100vw, 1152px"
        className="object-cover"
      />
    </Link>
  );
}
