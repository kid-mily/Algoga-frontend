"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import EvaluationForm from "./EvaluationForm";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";
import type { EvaluationFormQuestion } from "./types";

interface EvaluationPageClientProps {
    continentCode: string;
    countryId: string;
}

export default function EvaluationPageClient({
    continentCode,
    countryId,
}: EvaluationPageClientProps) {
    const router = useRouter();

    const [questions, setQuestions] = useState<EvaluationFormQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");


    const pathContinentCode = continentCode.trim().toLowerCase();

    useEffect(() => {
        const controller = new AbortController();

        const loadQuestions = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const result =
            await getDiagnosisQuestions(
                countryId,
                controller.signal
            );

            if (controller.signal.aborted) return;

            setQuestions(result);

            if (result.length === 0) {
            setErrorMessage(
                "등록된 진단평가 문제가 없습니다."
            );
            }
        } catch (error) {
            if (controller.signal.aborted) return;

            console.error(
            "[diagnosis] 문제 조회 실패:",
            error
            );

            if (error instanceof ApiRequestError) {
            if (error.status === 401) {
                const redirectUrl = `/classroom/${pathContinentCode}/${countryId}/evaluation`;

                router.replace(
                `/auth/login?redirect=${encodeURIComponent(
                    redirectUrl
                )}`
                );
                return;
            }

            if (error.status === 404) {
                setErrorMessage(
                "해당 국가의 진단평가 문제가 없습니다."
                );
                return;
            }

            setErrorMessage(error.message);
            return;
            }

            setErrorMessage(
            error instanceof Error
                ? error.message
                : "진단평가 문제를 불러오지 못했습니다."
            );
        } finally {
            if (!controller.signal.aborted) {
            setIsLoading(false);
            }
        }
        };

        loadQuestions();

        return () => {
        controller.abort();
        };
    }, [continentCode, countryId, router]);

    if (isLoading) {
        return (
        <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FA]">
            <p className="text-sm text-[#8A9BB0]">
            진단평가 문제를 불러오는 중입니다.
            </p>
        </main>
        );
    }

    if (errorMessage && questions.length === 0) {
        return (
        <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
            <section className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-bold text-[#0A1628]">
                진단평가를 시작할 수 없습니다
            </h1>

            <p className="mt-2 text-sm text-red-500">
                {errorMessage}
            </p>

            <button
                type="button"
                onClick={() => router.refresh()}
                className="mt-5 h-11 rounded-lg bg-[#439A97] px-5 text-sm font-bold text-white"
            >
                다시 시도
            </button>
            </section>
        </main>
        );
    }

    return (
        <EvaluationForm
            continentCode={pathContinentCode}
            countryId={countryId}
            questions={questions}
        />
    );
}