"use client";

import { useState } from "react";

type QuizFormMode =
  | "create"
  | "edit";

interface QuizFormProps {
  mode?: QuizFormMode;

  initialQuiz?: {
    lectureId: number;

    question: string;

    options: string[];

    answer: string;

    explanation: string;
  };
}

export default function QuizForm({
  mode = "create",

  initialQuiz = {
    lectureId: 1,

    question: "",

    options: [
      "",
      "",
      "",
      "",
    ],

    answer: "",

    explanation: "",
  },
}: QuizFormProps) {

  const [question, setQuestion] =
    useState(
      initialQuiz.question
    );

  const [options, setOptions] =
    useState(
      initialQuiz.options
    );

  const [answer, setAnswer] =
    useState(
      initialQuiz.answer
    );

  const [explanation, setExplanation] =
    useState(
      initialQuiz.explanation
    );

  const labels = [
    "A",
    "B",
    "C",
    "D",
  ];

  // 보기 수정
  const handleOptionChange = (
    index: number,
    value: string
  ) => {

    const updated = [...options];

    updated[index] = value;

    setOptions(updated);
  };

  return (
    <div className="mt-6 rounded-[24px] border border-[#E4E7EC] bg-white p-6">

      {/* 강의 선택 */}
      <div>

        <label className="text-[15px] font-semibold text-[#111827]">
          강의 선택
          <span className="text-[#D92D20]">
            {" "}*
          </span>
        </label>

        <select className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none">

          <option>
            강의를 선택해주세요
          </option>

          <option>
            일본 여행 완벽 가이드
          </option>

          <option>
            파리 완전 정복 2024
          </option>
        </select>
      </div>

      {/* 문제 */}
      <div className="mt-7">

        <label className="text-[15px] font-semibold text-[#111827]">
          문제
          <span className="text-[#D92D20]">
            {" "}*
          </span>
        </label>

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="퀴즈 문제를 입력하세요"
          className="mt-3 h-[120px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
        />
      </div>

      {/* 객관식 */}
      <div className="mt-7">

        <div className="flex items-center gap-2">

          <p className="text-[15px] font-semibold text-[#111827]">
            객관식 보기 (4지선다)
          </p>

          <span className="text-[#D92D20]">
            *
          </span>
        </div>

        <div className="mt-4 space-y-3">

          {options.map(
            (option, index) => {

              const isSelected =
                answer === option;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >

                  {/* 라디오 */}
                  <button
                    type="button"
                    onClick={() =>
                      setAnswer(option)
                    }
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold ${
                      isSelected
                        ? "bg-[#439A97] text-white"
                        : "bg-[#F2F4F7] text-[#667085]"
                    }`}
                  >
                    {labels[index]}
                  </button>

                  {/* 입력 */}
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`${index + 1}번 보기`}
                    className="h-[48px] flex-1 rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
                  />
                </div>
              );
            }
          )}
        </div>

        <p className="mt-3 text-[13px] text-[#98A2B3]">
          정답을 라디오 버튼으로 선택하세요
        </p>
      </div>

      {/* 해설 */}
      <div className="mt-7">

        <label className="text-[15px] font-semibold text-[#111827]">
          해설 (선택사항)
        </label>

        <textarea
          value={explanation}
          onChange={(e) =>
            setExplanation(
              e.target.value
            )
          }
          placeholder="오답노트에 표시될 해설을 입력하세요"
          className="mt-3 h-[100px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
        />

        <p className="mt-3 text-[13px] text-[#98A2B3]">
          이 해설은 오답노트에서 학생들에게 노출됩니다
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-8 flex items-center justify-end border-t border-[#E4E7EC] pt-6">

        <button
            type="button"
            className="h-[44px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
        >
            {mode === "create"
            ? "등록하기"
            : "수정하기"}
        </button>
       </div>
    </div>
  );
}