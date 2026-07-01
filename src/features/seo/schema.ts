import { getSiteUrl } from "./site";

const SITE_URL = getSiteUrl();

type CourseJsonLdInput = {
  title: string;
  description: string;
  url: string;
  price?: number;
  averageRating?: number;
  reviewCount?: number;
};

type CourseListJsonLdInput = {
  courses: {
    courseId: number;
    title: string;
    description: string;
    price?: number;
  }[];
  continentCode: string;
  countryId: string;
};

export const createOrganizationJsonLd = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "알고가",
    url: SITE_URL,
    logo: `${SITE_URL}/images/algoga-logo.png`,
  };
};

export const createWebSiteJsonLd = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "알고가",
    url: SITE_URL,
  };
};

export const createCourseJsonLd = ({
  title,
  description,
  url,
  price,
  averageRating,
  reviewCount = 0,
}: CourseJsonLdInput) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "알고가",
      url: SITE_URL,
      logo: `${SITE_URL}/images/algoga-logo.png`,
    },
    ...(price !== undefined && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(averageRating !== undefined &&
      reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount,
        },
      }),
  };
};

export const createCourseListJsonLd = ({
  courses,
  continentCode,
  countryId,
}: CourseListJsonLdInput) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        url: `${SITE_URL}/classroom/${continentCode.toLowerCase()}/${countryId}/lecture/${course.courseId}`,
        name: course.title,
        description: course.description || `${course.title} 강의입니다.`,
        provider: {
          "@type": "Organization",
          name: "알고가",
          url: SITE_URL,
        },
        ...(course.price !== undefined && {
          offers: {
            "@type": "Offer",
            price: course.price,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    })),
  };
};
