import Link from "next/link";

interface EvaluationResultEmptyProps {
    errorMessage: string;
    courseListHref: string;
}

export default function EvaluationResultEmpty({
    errorMessage,
    courseListHref,
}: EvaluationResultEmptyProps) {
    return (
        <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F4F7FB] px-4">
        <section className="w-full max-w-md rounded-[28px] border border-[#E1EAF0] bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4DF] text-xl font-bold text-[#A56B16]">
            !
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-[#0A1628]">
            결과를 확인할 수 없습니다
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#8A9BB0]">
            {errorMessage}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
            <Link
                href={courseListHref}
                className="flex h-11 items-center justify-center rounded-xl border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247]"
            >
                강의 목록
            </Link>

            <Link
                href={`${courseListHref}/evaluation`}
                className="flex h-11 items-center justify-center rounded-xl bg-[#D85F25] text-sm font-bold text-white"
            >
                다시 응시
            </Link>
            </div>
        </section>
        </main>
    );
}