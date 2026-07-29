import PackageLoungeListClient from "@/features/packagelounge/components/PackageLoungeListClient";
import type { PackageApiItem } from "@/features/packagelounge/types";
import { getPackagesByCountry } from "@/features/services/package.service";

interface PackageLoungePageProps {
  searchParams: Promise<{
    countryId?: string;
    courseId?: string;
    continentCode?: string;
  }>;
}

// 패키지 라운지 목록 페이지
export default async function PackageLoungePage({
  searchParams,
}: PackageLoungePageProps) {
  const { countryId, courseId, continentCode } = await searchParams;

  let packages: PackageApiItem[] = [];

  if (countryId) {
    try {
      packages = await getPackagesByCountry(countryId);
    } catch (error) {
      console.error("[packagelounge] 패키지 목록 조회 실패:", error);
      packages = [];
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* 페이지 상단 타이틀 영역 */}
        <section className="px-6 py-8">
          <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
            PACKAGE LOUNGE
          </span>

          <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
            패키지 라운지
          </h1>

          <p className="mt-2 text-sm text-[#8A9BB0]">
            항공권과 숙소가 하나로 묶인 여행 패키지를 탐색하세요
          </p>

          <PackageLoungeListClient
            packages={packages}
            courseId={courseId}
            continentCode={continentCode}
          />
        </section>
      </div>
    </main>
  );
}
