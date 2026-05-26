"use client";

import { useRouter } from "next/navigation";

import ChapterCard from "./ChapterCard";

import { chapters }
from "./MockData";

interface ChapterListProps {
  lectureId: number;

  hideEdit?: boolean;
}

export default function ChapterList({
  lectureId,
  hideEdit = false,
}: ChapterListProps) {

  const router = useRouter();

  // lecture별 필터
  const filteredChapters =
    chapters.filter(
      (chapter) =>
        chapter.lectureId === lectureId
    );

  return (
    <div className="mt-8 space-y-4">

      {filteredChapters.map((chapter) => (

        <ChapterCard
          key={chapter.id}

          id={chapter.id}

          duration={chapter.duration}

          title={chapter.title}

          description={chapter.description}

          onEdit={
            hideEdit
              ? undefined
              : () =>
                  router.push(
                    `/contentadmin/lecture/${lectureId}/chapter/${chapter.id}/edit`
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