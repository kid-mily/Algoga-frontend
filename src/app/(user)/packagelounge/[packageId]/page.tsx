import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PackageHero from "@/features/packagelounge/components/PackageHero";
import PackageDetailTabs from "@/features/packagelounge/components/PackageDetailTabs";
import PackageBookingSummary from "@/features/packagelounge/components/PackageBookingSummary";
import { toPackageDetailData } from "@/features/packagelounge/packageDetail.util";
import { buildQueryString } from "@/features/packagelounge/utils/query";
import { getPackageLoungeDetail } from "@/features/services/package.service";
import { ApiRequestError } from "@/lib/api";

interface PackageDetailPageProps {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{ courseId?: string; continentCode?: string }>;
}

// 패키지 라운지 상세보기 페이지
export default async function PackageDetailPage({
  params,
  searchParams,
}: PackageDetailPageProps) {
  const { packageId } = await params;
  const { courseId, continentCode } = await searchParams;

  let detail;
  try {
    detail = await getPackageLoungeDetail(packageId);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    console.error("[packagelounge] 패키지 상세 조회 실패:", error);
    throw error;
  }

  const data = toPackageDetailData(detail);
  const backHref = `/packagelounge${buildQueryString({
    countryId: detail.countryId,
    courseId,
    continentCode,
  })}`;

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* 상단 경로 표시 */}
        <div className="flex items-center gap-2">
          <Link href={backHref} aria-label="패키지 라운지로 돌아가기">
            <Image src="/images/arrow.svg" alt="" width={16} height={16} />
          </Link>
          <Link
            href={backHref}
            className="text-sm text-[#718096] hover:text-[#0A1628]"
          >
            패키지 라운지
          </Link>
          <span className="text-sm text-[#A0AEC0]">/</span>
          <span className="text-sm font-bold text-[#0A1628]">
            {data.title}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* 왼쪽 영역: 대표 이미지 + 탭 */}
          <div>
            <PackageHero
              title={data.title}
              destination={data.destination}
              duration={data.duration}
              dateRange={`${data.startDate} ~ ${data.endDate}`}
              imageSrc={data.heroImage}
            />
            <PackageDetailTabs data={data} />
          </div>

          {/* 오른쪽 영역: 예약 요약 카드 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PackageBookingSummary
              booking={data.booking}
              packageId={packageId}
              courseId={courseId}
              continentCode={continentCode}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
