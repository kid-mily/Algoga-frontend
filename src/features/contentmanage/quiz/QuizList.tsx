"use client";

import { useRouter } from "next/navigation";

import QuizCard from "./QuizCard";

import { quizzes }
from "@/features/contentmanage/MockData";

interface QuizListProps {
  lectureId?: number;
}

export default function QuizList({
  lectureId,
}: QuizListProps) {

  const router = useRouter();

  // 강의별 필터
  const filteredQuizzes =
    lectureId

      ? quizzes.filter(
          (quiz) =>
            quiz.lectureId === lectureId
        )

      : quizzes;

  return (
    <div className="mt-6 space-y-4">

      {filteredQuizzes.map((quiz) => (

        <QuizCard
          key={quiz.id}

          lectureTitle={
            quiz.lectureTitle
          }

          question={quiz.question}

          options={quiz.options}

          answer={quiz.answer}

          explanation={
            quiz.explanation
          }

          onView={() => {

            console.log("보기");
          }}

          onEdit={() =>
            router.push(
              `/contentadmin/quiz/${quiz.id}/edit`
            )
          }

          onDelete={() => {

            console.log("삭제");
          }}
        />
      ))}
    </div>
  );
}