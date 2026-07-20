describe("SEO site 유틸 테스트", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    jest.resetModules();

    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  });

  test("getSiteUrl은 설정된 URL의 마지막 슬래시를 제거한다", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.kr///";
    const { getSiteUrl } = await import("@/features/seo/site");

    expect(getSiteUrl()).toBe("https://algoga.kro.kr");
  });

  test("getSiteUrl은 빈 값, 오타 도메인, 잘못된 프로토콜, 잘못된 URL이면 null을 반환한다", async () => {
    const { getSiteUrl } = await import("@/features/seo/site");

    process.env.NEXT_PUBLIC_SITE_URL = "";
    expect(getSiteUrl()).toBeNull();

    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.ko";
    expect(getSiteUrl()).toBeNull();

    process.env.NEXT_PUBLIC_SITE_URL = "ftp://algoga.kro.kr";
    expect(getSiteUrl()).toBeNull();

    process.env.NEXT_PUBLIC_SITE_URL = "not-url";
    expect(getSiteUrl()).toBeNull();
  });

  test("serializeJsonLd는 XSS 위험 문자를 유니코드 escape 처리한다", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.kr";
    const { serializeJsonLd } = await import("@/features/seo/schema");

    expect(
      serializeJsonLd({
        name: "<알고가>&",
      })
    ).toBe('{"name":"\\u003c알고가\\u003e\\u0026"}');
  });

  test("사이트 URL이 없으면 JSON-LD 생성 함수들은 null을 반환한다", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    jest.resetModules();

    const {
      createCourseJsonLd,
      createCourseListJsonLd,
      createOrganizationJsonLd,
      createWebSiteJsonLd,
    } = await import("@/features/seo/schema");

    expect(createOrganizationJsonLd()).toBeNull();
    expect(createWebSiteJsonLd()).toBeNull();
    expect(
      createCourseJsonLd({
        title: "오사카 여행",
        description: "오사카 강의",
        url: "/lecture/1",
      })
    ).toBeNull();
    expect(
      createCourseListJsonLd({
        courses: [],
        continentCode: "ASIA",
        countryId: "1",
      })
    ).toBeNull();
  });

  test("사이트 URL이 있으면 Organization과 WebSite JSON-LD를 생성한다", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.kr";
    jest.resetModules();

    const { createOrganizationJsonLd, createWebSiteJsonLd } = await import(
      "@/features/seo/schema"
    );

    expect(createOrganizationJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "알고가",
      url: "https://algoga.kro.kr",
      logo: "https://algoga.kro.kr/images/algoga-logo.png",
    });
    expect(createWebSiteJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "알고가",
      url: "https://algoga.kro.kr",
    });
  });

  test("Course JSON-LD는 가격과 평점 조건에 따라 부가 정보를 포함한다", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.kr";
    jest.resetModules();

    const { createCourseJsonLd } = await import("@/features/seo/schema");

    expect(
      createCourseJsonLd({
        title: "오사카 여행",
        description: "오사카 강의",
        url: "https://algoga.kro.kr/classroom/asia/1/lecture/10",
        price: 120000,
        averageRating: 4.8,
        reviewCount: 12,
      })
    ).toMatchObject({
      "@type": "Course",
      name: "오사카 여행",
      offers: {
        "@type": "Offer",
        price: 120000,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 12,
      },
    });

    expect(
      createCourseJsonLd({
        title: "도쿄 여행",
        description: "도쿄 강의",
        url: "https://algoga.kro.kr/classroom/asia/1/lecture/11",
        averageRating: 4.8,
        reviewCount: 0,
      })
    ).not.toHaveProperty("aggregateRating");
  });

  test("CourseList JSON-LD는 강의 목록을 ItemList로 생성한다", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://algoga.kro.kr";
    jest.resetModules();

    const { createCourseListJsonLd } = await import("@/features/seo/schema");

    expect(
      createCourseListJsonLd({
        continentCode: "ASIA",
        countryId: "1",
        courses: [
          {
            courseId: 10,
            title: "오사카 여행",
            description: "",
            price: 120000,
          },
          {
            courseId: 11,
            title: "도쿄 여행",
            description: "도쿄 강의",
          },
        ],
      })
    ).toMatchObject({
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Course",
            url: "https://algoga.kro.kr/classroom/asia/1/lecture/10",
            description: "오사카 여행 강의입니다.",
            offers: {
              price: 120000,
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Course",
            url: "https://algoga.kro.kr/classroom/asia/1/lecture/11",
            description: "도쿄 강의",
          },
        },
      ],
    });
  });
});
