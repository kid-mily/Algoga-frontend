'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// URL 파라미터 안전 디코딩 헬퍼
const getParam = (value: string | string[] | undefined) => {
  if (!value) return '';
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function PaymentCompletePage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);
  const countryid = getParam(params.countryId || params.countryid);
  const courseId = getParam(params.courseId);

  // 강의실 상세 주소 정의
  const lectureDetailHref = (`/classroom/${continentCode}/${countryid}/lecture/${courseId}/study`);

  // 사용자가 이 완료 페이지 주소를 직접 치고 들어오는 등의 예외를 방어하기 위해 파라미터가 없으면 튕겨냄
  useEffect(() => {
    if (!continentCode || !countryid || !courseId) {
      alert('잘못된 접근입니다.');
      router.replace('/classroom');
    }
  }, [continentCode,countryid, courseId, router]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center border border-[#EBF0F5] shadow-sm">
        {/* 성공 표시 */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#EFFFFE] mb-6">
          <span className="text-4xl font-bold text-[#5E908D]">
            ✓
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-[#0A1628] mb-3">
          결제가 완료되었습니다!
        </h2>

        {/* 설명 */}
        <p className="text-sm text-[#8A9BB0] leading-6 mb-8">
          수강 신청이 정상적으로 처리되었습니다.
          <br />
          지금 바로 강의실에서 배움을 시작해 보세요.
        </p>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-3">

        <button
          type="button"
          onClick={() => router.push(lectureDetailHref)}
          className="w-full h-14 rounded-2xl bg-[#5E908D] text-white font-bold hover:bg-[#4F7F7C] transition"
        >
          바로 수강하러 가기
        </button>

        <button
          type="button"
          onClick={() => router.push('/classroom')}
          className="w-full h-14 rounded-2xl border border-[#DCE3EA] bg-white text-[#0A1628] font-semibold hover:bg-gray-50 transition"
        >
          다른 강의 둘러보기
        </button>

      </div>
    </div>
  </div>
  );
}