import PackageCard from "@/features/packagelounge/components/PackageCard";
import SubHeader from "@/features/common/components/SubHeader";
import { getCountryPackages } from "@/features/services/package.service";

interface PackageLoungePageProps {
  searchParams: Promise<{
    courseId?: string;
    countryId?: string;
    continentCode?: string;
  }>;
}

export default async function PackageLoungePage({
  searchParams,
}: PackageLoungePageProps) {
  const params = await searchParams;
  const courseId = Number(params.courseId);
  const countryId = Number(params.countryId);
  const continentCode = params.continentCode ?? "";

  const hasValidSelection =
    Number.isInteger(courseId) &&
    courseId > 0 &&
    Number.isInteger(countryId) &&
    countryId > 0 &&
    Boolean(continentCode);

  const backHref =
    continentCode && countryId
      ? `/classroom/${continentCode}/${countryId}`
      : "/classroom";

  if (!hasValidSelection) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
        <div className="mx-auto max-w-[860px]">
          <SubHeader
            backHref={backHref}
            backText="강의 다시 선택"
            title="패키지 목록"
            description="진단평가 추천 강의를 먼저 선택해주세요."
          />
          <p className="mt-10 text-center text-sm text-[#8796AA]">
            패키지는 추천 강의를 선택한 후 이용할 수 있습니다.
          </p>
        </div>
      </main>
    );
  }

  const packages = await getCountryPackages(countryId);

  return (
    <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
      <div className="mx-auto max-w-[860px]">
        <SubHeader
          backHref={backHref}
          backText="강의 다시 선택"
          title="패키지 목록"
          description="선택한 추천 강의와 함께 이용할 여행 패키지를 골라보세요."
        />

        {packages.length > 0 ? (
          <section className="mt-7 grid gap-5 md:grid-cols-2">
            {packages.map((item) => (
              <PackageCard
                key={item.packageId}
                item={item}
                courseId={courseId}
                continentCode={continentCode}
              />
            ))}
          </section>
        ) : (
          <p className="mt-10 text-center text-sm text-[#8796AA]">
            등록된 패키지가 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
