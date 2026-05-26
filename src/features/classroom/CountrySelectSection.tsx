'use client';

import Link from 'next/link';

const countries = [
  {
    name: '일본',
    slug: 'japan',
    image: '/images/japan.jpg',
    lectureCount: 15,
  },
  {
    name: '태국',
    slug: 'thailand',
    image: '/images/thailand.jpg',
    lectureCount: 8,
  },
  {
    name: '베트남',
    slug: 'vietnam',
    image: '/images/vietnam.jpg',
    lectureCount: 6,
  },
  {
    name: '싱가포르',
    slug: 'singapore',
    image: '/images/singapore.jpg',
    lectureCount: 5,
  },
];

export default function CountrySelectForm() {
  return (
    <section className="w-full">

      {/* 카드 리스트 */}
      <div
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px",}}
      >

        {countries.map((country) => (

          <Link
            key={country.slug}
            href={`/classroom/asia/${country.slug}`}
          >

            {/* 카드 */}
            <div
              className="
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
              "
            >

              {/* 이미지 */}
              <img
                src={country.image}
                alt={country.name}
                className="w-full h-[120px] object-cover"
              />

              {/* 텍스트 */}
              <div className="p-5">

                <p className="text-xl text-[#0A1628] font-bold">
                  {country.name}
                </p>

                <p className="mt-2 text-sm text-[#8A94A6]">
                  {country.lectureCount}개 강좌
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}