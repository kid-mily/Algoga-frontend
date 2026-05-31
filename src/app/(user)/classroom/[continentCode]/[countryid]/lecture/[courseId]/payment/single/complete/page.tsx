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
  const countryId = getParam(params.countryId || params.countryid);
  const courseId = getParam(params.courseId);

  // 강의실 상세 주소 정의
  const lectureDetailHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`;

  // 사용자가 이 완료 페이지 주소를 직접 치고 들어오는 등의 예외를 방어하기 위해 파라미터가 없으면 튕겨냄
  useEffect(() => {
    if (!continentCode || !countryId || !courseId) {
      alert('잘못된 접근입니다.');
      router.replace('/classroom');
    }
  }, [continentCode, countryId, courseId, router]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center border border-[#EBF0F5] shadow-sm">
        
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#EFFFFE] text-[#5E908D] mb-6">

        {/* 메인 타이틀 및 안내 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          결제가 완료되었습니다!
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          수강 신청이 정상적으로 처리되었습니다.<br />
          지금 바로 강의실에서 배움을 시작해 보세요.
        </p>

        {/*  버튼 */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(lectureDetailHref)}
            className="w-full h-[56px] bg-[#5E908D] hover:bg-[#4d7875] text-white font-bold rounded-2xl transition-colors shadow-sm"
          >
            바로 수강하러 가기
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/classroom')}
            className="w-full h-[56px] bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-2xl border border-[#DCE3EA] transition-colors"
          >
            다른 강의 둘러보기
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}