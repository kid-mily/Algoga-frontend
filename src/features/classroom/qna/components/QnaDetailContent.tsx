import { CourseQnaDetail } from "./types";
import { formatQnaDate, formatQnaDateTime, getStatusLabel, getWriterLabel } from "./utils";
import QnaCommentForm from "./QnaCommentForm";

interface QnaDetailContentProps {
    qna: CourseQnaDetail;
    courseId: string;
    qnaId: string;
}

export default function QnaDetailContent({ qna, courseId, qnaId }: QnaDetailContentProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <article className="p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8EDFF] text-sm font-bold text-[#5271E9]">
                    Q
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0A1628]">
                            {qna.userId}
                            </span>
                            <span className="text-xs text-slate-400">
                            {formatQnaDate(qna.createdAt)}
                            </span>
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-[#0A1628]">
                            {qna.title}
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                            {qna.question}
                        </p>
                        </div>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        qna.status === "ANSWERED"
                            ? "bg-[#DDF8E7] text-[#4A9D64]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {getStatusLabel(qna.status)}
                    </span>
                </div>
            </article>

            <div className="border-t border-slate-200 p-7">
                {qna.answer ? (
                <div className="rounded-2xl border border-[#D7E4FF] bg-white p-6">
                    <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5B78FF] text-sm font-bold text-white">
                        A
                    </div>

                    <div>
                        <p className="text-sm font-bold text-[#0A1628]">
                        여행 매니저 답변
                        </p>
                        {qna.answeredAt && (
                        <p className="text-xs text-slate-400">
                            {formatQnaDateTime(qna.answeredAt)}
                        </p>
                        )}
                    </div>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {qna.answer}
                    </p>
                </div>
                ) : (
                <div className="rounded-2xl bg-[#F5F6FA] p-6 text-center">
                    <p className="text-sm font-semibold text-slate-600">
                    아직 여행 매니저의 답변을 기다리고 있어요.
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                    답변이 등록되면 이곳에서 확인할 수 있습니다.
                    </p>
                </div>
                )}

                {qna.comments.length > 0 && (
                <div className="mt-6 space-y-3">
                    {qna.comments.map((comment) => {
                    const isManager = comment.writerType === "MANAGER";

                    return (
                        <div
                        key={comment.commentId}
                        className={`rounded-2xl border p-5 ${
                            isManager
                            ? "border-[#D7E4FF] bg-white"
                            : "border-slate-200 bg-[#F8F9FC]"
                        }`}
                        >
                        <div className="mb-3 flex items-center gap-3">
                            <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                                isManager
                                ? "bg-[#5B78FF] text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                            >
                            {isManager ? "A" : "Q"}
                            </div>

                            <div>
                            <p className="text-sm font-bold text-[#0A1628]">
                                {getWriterLabel(comment.writerType)}
                            </p>
                            <p className="text-xs text-slate-400">
                                {formatQnaDateTime(comment.createdAt)}
                            </p>
                            </div>
                        </div>

                        <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                            {comment.content}
                        </p>
                        </div>
                    );
                    })}
                </div>
                )}

                <QnaCommentForm courseId={courseId} qnaId={qnaId} />
            </div>
        </section>
    );
}
