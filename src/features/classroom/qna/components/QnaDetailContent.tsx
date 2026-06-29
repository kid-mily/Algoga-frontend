import {
  formatQnaDate,
  formatQnaDateTime,
  getCommentWriterName,
  getQnaWriterName,
  getStatusLabel,
} from "./utils";
import QnaCommentForm from "./QnaCommentForm";
import type { CourseQnaDetail } from "./types";

interface QnaDetailContentProps {
  qna: CourseQnaDetail;
  courseId: string;
  qnaId: string;
}

export default function QnaDetailContent({
  qna,
  courseId,
  qnaId,
}: QnaDetailContentProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
      <article className="p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF8F7] text-sm font-bold text-[#357F7C]">
              Q
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#0A1628]">
                  {getQnaWriterName(qna)}
                </span>

                <span className="text-xs text-[#A0AEC0]">
                  {formatQnaDate(qna.createdAt)}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#0A1628]">
                {qna.title}
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#475467]">
                {qna.question}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              qna.status === "ANSWERED"
                ? "bg-[#DDF8E7] text-[#4A9D64]"
                : "bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            {getStatusLabel(qna.status)}
          </span>
        </div>
      </article>

      <div className="border-t border-[#E1E8EF] p-7">
        {qna.answer ? (
          <div className="rounded-2xl border border-[#DDE8EF] bg-[#FAFCFE] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#439A97] text-sm font-bold text-white">
                A
              </div>

              <div>
                <p className="text-sm font-bold text-[#0A1628]">
                  여행 매니저 답변
                </p>

                {qna.answeredAt ? (
                  <p className="text-xs text-[#A0AEC0]">
                    {formatQnaDateTime(qna.answeredAt)}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-[#475467]">
              {qna.answer}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#F8FAFC] p-6 text-center">
            <p className="text-sm font-bold text-[#0A1628]">
              아직 답변을 기다리고 있습니다.
            </p>
            <p className="mt-2 text-sm text-[#8A94A6]">
              답변이 등록되면 이곳에서 확인할 수 있습니다.
            </p>
          </div>
        )}

        {qna.comments.length > 0 ? (
          <div className="mt-6 space-y-3">
            {qna.comments.map((comment) => {
              const isManager = comment.writerType === "MANAGER";

              return (
                <div
                  key={comment.commentId}
                  className={`rounded-2xl border p-5 ${
                    isManager
                      ? "border-[#DDE8EF] bg-[#FAFCFE]"
                      : "border-[#E1E8EF] bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        isManager
                          ? "bg-[#439A97] text-white"
                          : "bg-[#EEF8F7] text-[#357F7C]"
                      }`}
                    >
                      {isManager ? "A" : "Q"}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#0A1628]">
                        {getCommentWriterName(comment)}
                      </p>

                      <p className="text-xs text-[#A0AEC0]">
                        {formatQnaDateTime(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-7 text-[#475467]">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        <QnaCommentForm courseId={courseId} qnaId={qnaId} />
      </div>
    </section>
  );
}