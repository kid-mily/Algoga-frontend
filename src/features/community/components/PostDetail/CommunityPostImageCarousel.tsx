import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CommunityPostImageCarouselProps } from "@/features/community/types";

export default function CommunityPostImageCarousel({
  imageUrls,
  fallbackImageUrl,
  imageAlt,
  currentImageIndex,
  onPrev,
  onNext,
}: CommunityPostImageCarouselProps) {
  const currentImageUrl = imageUrls[currentImageIndex] ?? fallbackImageUrl;
  const hasMultipleImages = imageUrls.length > 1;

  if (!currentImageUrl) return null;

  return (
    <div className="relative h-[350px] border-y border-[#CFE0DE] bg-[#EEF4F4]">
      <Image
        src={currentImageUrl}
        alt={`${imageAlt} 이미지 ${currentImageIndex + 1}`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 768px"
      />

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#5F928E] shadow-[0_6px_16px_rgba(47,42,38,0.16)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D]"
            aria-label="이전 사진 보기"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#5F928E] shadow-[0_6px_16px_rgba(47,42,38,0.16)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA19D]"
            aria-label="다음 사진 보기"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
        </>
      )}
    </div>
  );
}
