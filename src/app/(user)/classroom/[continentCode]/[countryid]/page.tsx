// 국가별 강의 목록 페이지

import LectureGrid from "@/features/classroom/components/LectureGrid";
import LecturePageHeader from "@/features/classroom/components/LecturePageHeader";
import EvaluationBanner from "@/features/classroom/components/EvaluationBanner";
import { Country, CourseItem } from "@/features/classroom/components/types";
import { createCourseListJsonLd } from "@/features/seo/schema";
import { getCountries } from "@/features/services/countrySelect.service";
import { getCourses } from "@/features/services/lectureSelect.service";
import { Metadata } from "next";

export const revalidate = 600;

interface LectureListPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
  }>;
}

export async function generateMetadata({
  params,
}: LectureListPageProps): Promise<Metadata> {
  const { continentCode, countryid } = await params;
  const normalizedContinentCode = continentCode.trim().toUpperCase();

  let countryName = "국가별";

  try {
    const countries = await getCountries(normalizedContinentCode);
    const selectedCountry = countries.find(
      (country) => String(country.countryId) === String(countryid)
    );

    countryName = selectedCountry?.countryName ?? countryName;
  } catch {
    countryName = "국가별";
  }

  const title = `${countryName} 강의 목록`;
  const description = `${countryName} 여행 전 필요한 표현과 상황별 학습 콘텐츠를 확인해 보세요.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ALGOGA`,
      description,
      url: `/classroom/${continentCode}/${countryid}`,
      images: [
        {
          url: "/images/og-image.png",
          width: 1100,
          height: 740,
          alt: `${countryName} ALGOGA 강의 목록`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ALGOGA`,
      description,
      images: ["/images/og-image.png"],
    },
  };
}

export default async function LectureListPage({
  params,
}: LectureListPageProps) {
  const { continentCode, countryid } = await params;
  const normalizedContinentCode = continentCode.trim().toUpperCase();

  let lectures: CourseItem[] = [];
  let countries: Country[] = [];

  try {
    const [lectureList, countryList] = await Promise.all([
      getCourses(countryid),
      getCountries(normalizedContinentCode),
    ]);

    lectures = lectureList;
    countries = countryList;
  } catch (error) {
    console.error("[lecture-list] 강의 목록 또는 국가 정보 조회 실패:", error);
    lectures = [];
    countries = [];
  }

  const selectedCountry = countries.find(
    (country) => String(country.countryId) === String(countryid)
  );

  const countryName = selectedCountry?.countryName ?? "선택한 국가";
  const courseListJsonLd = lectures.length
    ? createCourseListJsonLd({
        courses: lectures,
        continentCode: normalizedContinentCode,
        countryId: countryid,
      })
    : null;

  return (
    <>
      {courseListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseListJsonLd),
          }}
        />
      )}

      <main className="min-h-screen w-full bg-[#F3F8FC] px-4 pb-14 pt-6 sm:px-6 lg:px-10">
        <section className="mx-auto w-full max-w-4xl">
          <LecturePageHeader
            continentCode={normalizedContinentCode}
            countryName={countryName}
          />

          <div className="mt-6">
            <EvaluationBanner
              continentCode={normalizedContinentCode}
              countryId={countryid}
            />
          </div>

          <section aria-labelledby="lecture-list-title" className="mt-8">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2
                  id="lecture-list-title"
                  className="mt-1 text-2xl font-bold text-[#0A1628]"
                >
                  {countryName} 강의 목록
                </h2>

                <p className="mt-1 text-sm text-[#8A94A6]">
                  여행 전 필요한 표현과 상황별 학습 콘텐츠를 확인해 보세요.
                </p>
              </div>

              <div className="rounded-full border border-[#DDE8EF] bg-white px-4 py-2 text-sm font-bold text-[#718096]">
                총 {lectures.length}개 강의
              </div>
            </div>

            <LectureGrid
              lectures={lectures}
              continentCode={normalizedContinentCode}
              countryId={countryid}
            />
          </section>
        </section>
      </main>
    </>
  );
}
