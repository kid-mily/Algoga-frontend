'use client'; 

import { useState } from 'react';
import Modal from '../../common/components/Modal';
import { useParams, useRouter } from 'next/navigation';

export default function TabNavigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const params = useParams();
  const { continentid, countryid } = params;

  const handlePackageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push(`/classroom/${continentid}/${countryid}/evaluation`); 
  };

  return (
    <>
      <div className="flex gap-3 mb-6">
        {/* 기본 활성화 스타일 */}
        <button className="flex items-center gap-2 bg-[#439A97] text-white font-medium text-sm px-5 py-3 rounded-2xl shadow-sm cursor-pointer">
          <img src="/images/BookIcon.svg" alt="책" /> 단과 강의실
        </button>

        {/* 클릭 시 모달 오픈 */}
        <button 
          onClick={handlePackageClick}
          className="flex items-center gap-2 bg-white text-[#8A9BB0] font-medium text-sm px-5 py-3 rounded-2xl shadow-sm cursor-pointer"
        >
          <img src="/images/AirplaneIcon.svg" alt="비행기" /> 패키지 라운지
        </button>
      </div>

      {/* 진단평가 안내 모달창 */}
      <Modal
        open={isModalOpen}
        title="진단 평가 필수"
        description="패키지 라운지는 진단 평가가 필수입니다. 나에게 맞는 강의와 여행 일정을 추천받으세요."
        confirmText="진단평가 시작"
        cancelText="취소"
        onConfirm={handleModalConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}