// 진단평가 페이지

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import TimerPage from '@/features/classroom/components/Timer';
import SubHeader from '@/features/contentmanage/common/SubHeader';
import CheckModal from '@/features/common/CheckModal';

const questions = [
  {
    id: 1,
    question: '여행 경험이 어느 정도인가요?',
    description: '가장 가까운 답변을 선택해주세요.',
    answers: [
      '처음 여행을 준비합니다',
      '1-2번 정도 여행해봤습니다',
      '자주 여행을 다닙니다',
    ],
  },
  {
    id: 2,
    question: '여행 스타일은 어떤 편인가요?',
    description: '가장 원하는 스타일을 선택해주세요.',
    answers: ['맛집 탐방', '휴양과 힐링', '액티비티 여행'],
  },
  {
    id: 3,
    question: '여행 준비는 얼마나 하시나요?',
    description: '가장 가까운 답변을 선택해주세요.',
    answers: ['거의 준비 안 해요', '기본 일정만 짜요', '세세하게 계획해요'],
  },
];

export default function Evaluation() {
  const router = useRouter();
  const { continentid, countryid } = useParams();

  const [step, setStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const question = questions[step];
  const pick = selectedAnswers[step] || '';

  const isLast = step === questions.length - 1;

  const progress = ((step + 1) / questions.length) * 100;

  // 모달 확인
  const handleModalConfirm = () => {
    setIsOpen(false);

    router.push(
      `/classroom/${continentid}/${countryid}/evaluation/result`
    );
  };

  // 다음 버튼
  const handleNext = () => {
    if (!pick) return;

    if (!isLast) {
      setStep((prev) => prev + 1);
    } else {
      setIsOpen(true);
    }
  };

  // 이전 버튼
  const handlePrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  // 답변 선택
  const selectAnswer = (answer: string) => {
    const updated = [...selectedAnswers];
    updated[step] = answer;
    setSelectedAnswers(updated);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6f8] p-10">
      <div className="max-w-5xl mx-auto pt-32">

        {/* 헤더 */}
        <SubHeader
          backHref={`/classroom/${continentid}/${countryid}`}
          backText="돌아가기"
          title=""
          description=""
        />

        {/* 상단 카드 */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

          {/* 제목 */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#0A1628]">
                {countryid} 여행 진단 평가
              </h1>

              <p className="text-xl text-[#8A94A6] mt-5">
                나에게 맞는 강의를 추천받으세요
              </p>
            </div>

            {/* 타이머 */}
            <div className="bg-[#FFF3E0] px-6 py-4 rounded-3xl flex items-center gap-3">
              <img
                src="/images/Timer.svg"
                alt="타이머"
                className="w-6 h-6"
              />

              <TimerPage />
            </div>
          </div>

          {/* 진행률 */}
          <div className="mt-10">

            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-[#0A1628]">
                문제 {step + 1} / {questions.length}
              </p>

              <span className="text-[#8A94A6] font-semibold">
                {Math.round(progress)}% 완료
              </span>
            </div>

            {/* 진행 바 */}
            <div className="w-full h-3 bg-[#E8EEF5] rounded-full mt-5 border">
              <div
                className="h-full bg-[#439A97] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 문제 번호 */}
            <div className="flex gap-3 mt-8">
              {questions.map((_, num) => (
                <div
                  key={num}
                  className={`w-12 h-8 rounded-xl flex items-center justify-center text-sm font-bold border ${
                    step === num
                      ? 'border-[#439A97] text-[#439A97]'
                      : 'border-[#E8EEF5] text-[#B0BEC5]'
                  }`}
                >
                  {num + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 문제 카드 */}
        <div className="bg-white rounded-3xl p-10 shadow-sm mt-10">

          {/* 질문 */}
          <div>
            <h2 className="text-4xl font-bold text-[#0A1628]">
              Q{step + 1}. {question.question}
            </h2>

            <p className="text-lg text-[#8A94A6] mt-3">
              {question.description}
            </p>
          </div>

          {/* 답변 */}
          <div className="flex flex-col gap-5 mt-10">
            {question.answers.map((answer) => {
              const isSelected = pick === answer;

              return (
                <button
                  key={answer}
                  onClick={() => selectAnswer(answer)}
                  className={`w-full h-16 rounded-2xl border px-8 flex items-center text-xl font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#439A97] bg-[#439A97] text-white'
                      : 'border-[#E4EAF2] bg-white text-[#0A1628] hover:border-[#439A97]'
                  }`}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-5 mt-10 pb-20">

          {/* 이전 */}
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`flex-1 h-[50px] rounded-3xl text-2xl font-bold border transition ${
              step === 0
                ? 'bg-[#E4EAF2] border-[#E4EAF2] text-[#B4BEC8] cursor-not-allowed'
                : 'bg-white border-[#E4EAF2] text-[#0A1628] hover:bg-gray-50 cursor-pointer'
            }`}
          >
            이전
          </button>

          {/* 다음 */}
          <button
            onClick={handleNext}
            disabled={!pick}
            className={`flex-1 h-[50px] rounded-3xl text-2xl font-bold ${
              pick
                ? 'bg-[#439A97] text-white hover:bg-[#357A78] cursor-pointer'
                : 'bg-[#E4EAF2] text-[#B4BEC8] cursor-not-allowed'
            }`}
          >
            {isLast ? '제출하기' : '다음'}
          </button>
        </div>
      </div>

      {/* 완료 모달 */}
      <CheckModal
        open={isOpen}
        title="완료되었습니다"
        description="진단 평가가 완료되었습니다."
        onConfirm={handleModalConfirm}
      />
    </div>
    
  );
}