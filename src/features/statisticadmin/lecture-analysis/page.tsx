"use client";

import SimpleSubHeader from "@/features/common/SimpleSubHeader";

const courses = [
  {
    title: "도쿄 완전 정복",
    students: "1,245명",
    averageProgress: 72,
    completionRate: "68%",
    averageStudyTime: "12.5시간",
  },
  {
    title: "파리 여행 가이드",
    students: "987명",
    averageProgress: 68,
    completionRate: "65%",
    averageStudyTime: "10.3시간",
  },
  {
    title: "뉴욕 탐방",
    students: "856명",
    averageProgress: 65,
    completionRate: "62%",
    averageStudyTime: "11.2시간",
  },
  {
    title: "런던 역사 투어",
    students: "745명",
    averageProgress: 58,
    completionRate: "54%",
    averageStudyTime: "9.8시간",
  },
  {
    title: "로마 문화 체험",
    students: "623명",
    averageProgress: 54,
    completionRate: "50%",
    averageStudyTime: "8.5시간",
  },
  {
    title: "바르셀로나 가우디",
    students: "534명",
    averageProgress: 62,
    completionRate: "58%",
    averageStudyTime: "9.2시간",
  },
  {
    title: "싱가포르 시티투어",
    students: "498명",
    averageProgress: 70,
    completionRate: "66%",
    averageStudyTime: "8.0시간",
  },
  {
    title: "방콕 로컬 탐방",
    students: "467명",
    averageProgress: 61,
    completionRate: "57%",
    averageStudyTime: "7.5시간",
  },
  {
    title: "발리 힐링 여행",
    students: "432명",
    averageProgress: 75,
    completionRate: "71%",
    averageStudyTime: "9.0시간",
  },
  {
    title: "이스탄불 역사기행",
    students: "389명",
    averageProgress: 55,
    completionRate: "51%",
    averageStudyTime: "10.1시간",
  },
];

export default function CourseAnalysisPage() {
  return (
    <div>
      <SimpleSubHeader
        title="수강률 분석"
        description="강의별 수강 현황을 확인합니다"
      />

      <section className="mt-6 mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-[42px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
            <img
              src="/images/search.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px]"
            />

            <input
              type="text"
              placeholder="강의명 검색..."
              className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          <button className="flex h-[42px] items-center gap-2 rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[13px] font-semibold text-[#344054]">
            <img
              src="/images/download.svg"
              alt=""
              aria-hidden="true"
              className="h-[15px] w-[15px]"
            />
            CSV 내보내기
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[14px] font-bold text-[#344054]">
              <th className="px-6 py-4">강의명 ↕</th>
              <th className="w-[220px] px-6 py-4">수강생 수 ↕</th>
              <th className="w-[260px] px-6 py-4">평균 진도율 ↕</th>
              <th className="w-[220px] px-6 py-4">수료율 ↕</th>
              <th className="w-[220px] px-6 py-4">평균 학습 시간</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr
                key={course.title}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-6 py-5 font-bold text-[#111827]">
                  {course.title}
                </td>

                <td className="px-6 py-5">{course.students}</td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-[7px] w-[100px] overflow-hidden rounded-full bg-[#E5E7EB]">
                      <div
                        className="h-full rounded-full bg-[#639E9B]"
                        style={{ width: `${course.averageProgress}%` }}
                      />
                    </div>

                    <span className="text-[14px] font-bold text-[#111827]">
                      {course.averageProgress}%
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 font-semibold text-[#16A34A]">
                  {course.completionRate}
                </td>

                <td className="px-6 py-5">{course.averageStudyTime}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-[#EEF0F3] px-6 py-4">
          <p className="text-[13px] font-medium text-[#667085]">
            총 20개 강의 · 1/2 페이지
          </p>

          <div className="flex items-center gap-2">
            <button className="text-[18px] text-[#98A2B3]">‹</button>

            <button className="h-[32px] w-[32px] rounded-[7px] bg-[#639E9B] text-[13px] font-bold text-white">
              1
            </button>

            <button className="h-[32px] w-[32px] rounded-[7px] text-[13px] font-bold text-[#344054] hover:bg-[#F5F7FA]">
              2
            </button>

            <button className="text-[18px] text-[#344054]">›</button>
          </div>
        </div>
      </section>
    </div>
  );
}