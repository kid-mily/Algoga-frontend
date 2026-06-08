"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { getAdminCourses } from "@/features/services/adminCourse.service";
import {
  createAdminQuiz,
  updateAdminQuiz,
} from "@/features/services/adminQuiz.service";
import { AdminCourse } from "../lecture/types";

type QuizFormMode = "create" | "edit";

interface QuizFormProps {
  mode?: QuizFormMode;
  initialQuiz?: {
    quizId?: number;
    courseId: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctOption: number;
    explanation: string;
  };
}

const emptyQuiz = {
  courseId: 0,
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctOption: 1,
  explanation: "",
};

export default function QuizForm({
  mode = "create",
  initialQuiz = emptyQuiz,
}: QuizFormProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [courseId, setCourseId] = useState<number>(initialQuiz.courseId);
  const [question, setQuestion] = useState(initialQuiz.question);
  const [options, setOptions] = useState<string[]>([
    initialQuiz.option1,
    initialQuiz.option2,
    initialQuiz.option3,
    initialQuiz.option4,
  ]);
  const [correctOption, setCorrectOption] = useState<number>(
    initialQuiz.correctOption
  );
  const [explanation, setExplanation] = useState(initialQuiz.explanation);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const labels = ["A", "B", "C", "D"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getAdminCourses();
        setCourses(courseList);
      } catch (error: any) {
        setErrorMessage(error?.message || "강의 목록을 불러오지 못했습니다.");
      }
    };

    fetchCourses();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const validateForm = () => {
    if (!courseId) {
      setErrorMessage("강의를 선택해주세요.");
      return false;
    }

    if (!question.trim()) {
      setErrorMessage("퀴즈 문제를 입력해주세요.");
      return false;
    }

    if (options.some((option) => !option.trim())) {
      setErrorMessage("객관식 보기를 모두 입력해주세요.");
      return false;
    }

    if (correctOption < 1 || correctOption > 4) {
      setErrorMessage("정답은 1번부터 4번 중 선택해야 합니다.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const submitQuiz = async () => {
    if (!validateForm()) return;

    const payload = {
      question: question.trim(),
      option1: options[0].trim(),
      option2: options[1].trim(),
      option3: options[2].trim(),
      option4: options[3].trim(),
      correctOption,
      explanation: explanation.trim(),
    };

    try {
      if (mode === "create") {
        await createAdminQuiz({
          courseId,
          ...payload,
        });
      } else {
        if (!initialQuiz.quizId) {
          setErrorMessage("수정할 퀴즈 ID를 찾을 수 없습니다.");
          return;
        }

        await updateAdminQuiz(courseId, initialQuiz.quizId, payload);
      }

      setOpenCompleteModal(true);
    } catch (error: any) {
      setErrorMessage(error?.message || "퀴즈 저장에 실패했습니다.");
    }
  };

  const handleSubmit = () => {
    if (mode === "create") {
      submitQuiz();
    } else {
      setOpenEditModal(true);
    }
  };

  return (
    <div className="mt-6 rounded-[24px] border border-[#E4E7EC] bg-white p-6">
      <div>
        <label className="text-[15px] font-semibold text-[#111827]">
          강의 선택
          <span className="text-[#D92D20]"> *</span>
        </label>

        <select
          value={courseId || ""}
          onChange={(e) => setCourseId(Number(e.target.value))}
          disabled={mode === "edit"}
          className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none disabled:bg-gray-100"
        >
          <option value="">강의를 선택해주세요</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7">
        <label className="text-[15px] font-semibold text-[#111827]">
          문제
          <span className="text-[#D92D20]"> *</span>
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="퀴즈 문제를 입력하세요"
          className="mt-3 h-[120px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
        />
      </div>

      <div className="mt-7">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold text-[#111827]">
            객관식 보기 (4지선다)
          </p>
          <span className="text-[#D92D20]">*</span>
        </div>

        <div className="mt-4 space-y-3">
          {options.map((option, index) => {
            const optionNumber = index + 1;
            const isSelected = correctOption === optionNumber;

            return (
              <div key={index} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOption(optionNumber)}
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold ${
                    isSelected
                      ? "bg-[#439A97] text-white"
                      : "bg-[#F2F4F7] text-[#667085]"
                  }`}
                >
                  {labels[index]}
                </button>

                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`${optionNumber}번 보기`}
                  className="h-[48px] flex-1 rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
                />
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[13px] text-[#98A2B3]">
          정답을 라디오 버튼으로 선택하세요
        </p>
      </div>

      <div className="mt-7">
        <label className="text-[15px] font-semibold text-[#111827]">
          해설 (선택사항)
        </label>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="오답노트에 표시될 해설을 입력하세요"
          className="mt-3 h-[100px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
        />

        <p className="mt-3 text-[13px] text-[#98A2B3]">
          이 해설은 오답노트에서 학생들에게 노출됩니다
        </p>
      </div>

      {errorMessage && (
        <div className="mt-5 rounded-[14px] bg-red-50 p-3 text-[14px] text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="mt-8 flex items-center justify-end border-t border-[#E4E7EC] pt-6">
        <button
          type="button"
          className="h-[44px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
          onClick={handleSubmit}
        >
          {mode === "create" ? "등록하기" : "수정하기"}
        </button>
      </div>

      <Modal
        open={openEditModal}
        title="퀴즈 수정"
        description="퀴즈를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setOpenEditModal(false);
          submitQuiz();
        }}
        onCancel={() => setOpenEditModal(false)}
      />

      <CompleteModal
        open={openCompleteModal}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "퀴즈가 등록되었습니다."
            : "퀴즈가 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => {
          setOpenCompleteModal(false);
          router.push("/contentadmin/quiz");
        }}
      />
    </div>
  );
}
