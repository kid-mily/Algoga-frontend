import Image from "next/image";
import { Banner } from "../types";

interface BannerSlideProps {
  banner: Banner;
  isActive: boolean;
  isPriority: boolean;
}

export default function BannerSlide({
  banner,
  isActive,
  isPriority,
}: BannerSlideProps) {
  return (
    <a
      href={banner.linkUrl || "/"}
      className={`absolute inset-0 block transition-opacity duration-500 ${
        isActive
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <Image
        src={banner.imageUrl}
        alt={banner.text || "메인 배너"}
        fill
        priority={isPriority}
        sizes="(max-width: 768px) 100vw, 1152px"
        className="object-cover"
      />
    </a>
  );
}