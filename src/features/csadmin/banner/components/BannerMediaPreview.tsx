import { BannerFileType } from "../types";

type BannerMediaPreviewProps = {
  src: string;
  fileType: BannerFileType;
  alt: string;
  className?: string;
};

export default function BannerMediaPreview({
  src,
  fileType,
  alt,
  className = "h-full w-full object-cover",
}: BannerMediaPreviewProps) {
  if (!src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#EAF6EE] text-[#98A2B3]">
        <img src="/images/eye.svg" alt="" aria-hidden="true" className="h-[34px] w-[34px]" />
        <span className="text-[15px] font-semibold">미디어 없음</span>
      </div>
    );
  }

  if (fileType === "VIDEO") {
    return (
      <video
        src={src}
        className={className}
        controls
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
