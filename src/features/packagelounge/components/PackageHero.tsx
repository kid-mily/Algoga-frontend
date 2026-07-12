import Image from "next/image";

interface PackageHeroProps {
  title: string;
  destination: string;
  duration: string;
  dateRange: string;
  imageSrc: string;
}

// 패키지 상세 페이지 상단 대표 이미지 영역
export default function PackageHero({
  title,
  destination,
  duration,
  dateRange,
  imageSrc,
}: PackageHeroProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 720px"
        priority
        className="object-cover"
      />
      {/* 글자 가독성을 위한 어두운 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <h1 className="text-xl font-extrabold text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 text-sm font-medium text-white/90">
          {destination}
        </p>
        <p className="mt-1 text-xs text-white/80">
          {duration} · {dateRange}
        </p>
      </div>
    </div>
  );
}
