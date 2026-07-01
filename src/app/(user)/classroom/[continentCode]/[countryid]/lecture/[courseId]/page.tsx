import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import SubHeader from "@/features/common/components/SubHeader";
import LectureActionCard from "@/features/classroom/components/LectureActionCard";
import LectureAttachments from "@/features/classroom/components/LectureAttachments";
import LectureReviews from "@/features/classroom/components/LectureReviews";
import { createCourseJsonLd } from "@/features/seo/schema";
import { getSiteUrl } from "@/features/seo/site";
import {
  getCourseDetail,
  getCourseReviewSummary,
} from "@/features/services/lectureDetail.service";

export const revalidate = 600;

interface LectureDetailPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

const SITE_URL = getSiteUrl();
const DEFAULT_DESCRIPTION =
  "알고가에서 국가별 여행 강의를 확인하고 여행 전 필요한 표현과 상황별 학습을 시작하세요.";

const EMPTY_REVIEW_SUMMARY = {
  courseId: 0,
  averageRating: 0,
  totalReviewCount: 0,
  fiveStarCount: 0,
  fourStarCount: 0,
  threeStarCount: 0,
  twoStarCount: 0,
  oneStarCount: 0,
  fiveStarRate: 0,
  fourStarRate: 0,
  threeStarRate: 0,
  twoStarRate: 0,
  oneStarRate: 0,
};

const continentStyle: Record<
  string,
  {
    accent: string;
    soft: string;
    text: string;
  }
> = {
  ASIA: {
    accent: "bg-[#439A97]",
    soft: "bg-[#EEF8F7]",
    text: "text-[#357F7C]",
  },
  EUROPE: {
    accent: "bg-[#4F7FD9]",
    soft: "bg-[#F0F5FF]",
    text: "text-[#416AB8]",
  },
  NORTH_AMERICA: {
    accent: "bg-[#D6A640]",
    soft: "bg-[#FFF8E8]",
    text: "text-[#A87512]",
  },
  SOUTH_AMERICA: {
    accent: "bg-[#D96A5B]",
    soft: "bg-[#FFF1EF]",
    text: "text-[#BC4F43]",
  },
  AFRICA: {
    accent: "bg-[#C8843A]",
    soft: "bg-[#FFF4E8]",
    text: "text-[#A86425]",
  },
  OCEANIA: {
    accent: "bg-[#7C6FD6]",
    soft: "bg-[#F3F1FF]",
    text: "text-[#6558C8]",
  },
  ANTARCTICA: {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
  },
};

const getContinentStyle = (continentCode: string) =>
  continentStyle[continentCode.toUpperCase()] ?? {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F8FAFC]",
    text: "text-[#64748B]",
  };

const normalizeDescription = (description?: string) => {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return DEFAULT_DESCRIPTION;
  }

  return trimmedDescription.length > 150
    ? `${trimmedDescription.slice(0, 147)}...`
    : trimmedDescription;
};

// 메타데이터
export async function generateMetadata({
  params,
}: LectureDetailPageProps): Promise<Metadata> {
  const { continentCode, countryid, courseId } = await params;
  const normalizedContinentCode = continentCode.trim().toLowerCase();
  const canonicalUrl = `${SITE_URL}/classroom/${normalizedContinentCode}/${countryid}/lecture/${courseId}`;

  try {
    const course = await getCourseDetail(countryid, courseId);

    if (!course) {
      return {
        title: "강의 상세",
        description: DEFAULT_DESCRIPTION,
      };
    }

    const pageTitle = course.title;
    const socialTitle = `${course.title} | 알고가`;
    const description = normalizeDescription(course.description);

    return {
      title: pageTitle,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: socialTitle,
        description,
        url: canonicalUrl,
        type: "website",
        images: course.thumbnailUrl
          ? [
              {
                url: course.thumbnailUrl,
                alt: course.title,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "강의 상세",
      description: DEFAULT_DESCRIPTION,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function LectureDetailPage({
  params,
}: LectureDetailPageProps) {
  const { continentCode, countryid, courseId } = await params;
  const normalizedContinentCode = continentCode.trim().toUpperCase();
  const style = getContinentStyle(normalizedContinentCode);

  const [course, reviewSummary] = await Promise.all([
    getCourseDetail(countryid, courseId),
    getCourseReviewSummary(courseId).catch(() => ({
      ...EMPTY_REVIEW_SUMMARY,
      courseId: Number(courseId) || 0,
    })),
  ]);

  if (!course) {
    notFound();
  }

  const safeReviewSummary = reviewSummary ?? {
    ...EMPTY_REVIEW_SUMMARY,
    courseId: Number(courseId) || 0,
  };

  // 리치스니펫
  const jsonLd = createCourseJsonLd({
    title: course.title,
    description: normalizeDescription(course.description),
    url: `${SITE_URL}/classroom/${normalizedContinentCode.toLowerCase()}/${countryid}/lecture/${courseId}`,
    price: course.price,
    averageRating: safeReviewSummary.averageRating,
    reviewCount: safeReviewSummary.totalReviewCount,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="min-h-screen w-full bg-[#F3F8FC] px-4 pb-14 pt-6 sm:px-6 lg:px-10">
        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SubHeader
            backHref={`/classroom/${normalizedContinentCode}/${countryid}`}
            backText="강의 목록으로 돌아가기"
            title=""
            description=""
          />

          <section className="relative overflow-hidden rounded-[28px] border border-[#E1E8EF] bg-white shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
            <div
              className={`absolute left-0 top-0 h-full w-1.5 ${style.accent}`}
            />

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="px-6 py-6 pl-8">
                <p
                  className={`text-sm font-semibold tracking-[0.16em] ${style.text}`}
                >
                  COURSE TICKET
                </p>

                <h1 className="mt-2 text-2xl font-bold leading-snug text-[#0A1628]">
                  {course.title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718096]">
                  {course.description}
                </p>

                <div className="mt-6 border-t border-dashed border-[#D6E0E8] pt-4">
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#A0AEC0]">
                    TRAVEL CLASSROOM
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#718096]">
                    강의 상세를 확인하고 결제 또는 학습을 이어가세요.
                  </p>
                </div>
              </div>

              <div className="relative min-h-[220px] border-t border-dashed border-[#D6E0E8] bg-[#FAFCFE] lg:border-l lg:border-t-0">
                <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC] lg:block" />

                {course.thumbnailUrl ? (
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 340px"
                    quality={75}
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full min-h-[220px] items-center justify-center ${style.soft}`}
                  >
                    <span className={`text-sm font-bold ${style.text}`}>
                      COURSE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <LectureActionCard
            course={course}
            continentCode={normalizedContinentCode}
            countryId={countryid}
            courseId={courseId}
          />

          <LectureAttachments
            courseId={courseId}
            fileUrls={course.fileUrls ?? []}
          />

          <LectureReviews
            summary={safeReviewSummary}
            continentCode={normalizedContinentCode}
            countryId={countryid}
            courseId={courseId}
          />
        </section>
      </main>
    </>
  );
}
