"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/features/common/components/Modal";
import { ApiRequestError } from "@/lib/api";
import EvaluationForm from "./EvaluationForm";
import { getDiagnosisQuestions } from "@/features/services/evaluation.service";
import { EvaluationFormQuestion } from "./types";

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

  // 다시 시도 버튼을 눌렀을 때 useEffect를 다시 실행시키기 위한 값
  const [retryCount, setRetryCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // URL에 들어가는 대륙 코드는 소문자로 통일
  const pathContinentCode = continentCode.trim().toLowerCase();

  // 로그인 후 다시 돌아올 진단평가 주소
  const evaluationHref = `/classroom/${pathContinentCode}/${countryId}/evaluation`;

  // 모달에서 돌아가기를 눌렀을 때 이동할 강의 목록 주소
  const courseListHref = `/classroom/${pathContinentCode}/${countryId}`;

  const loginHref = `/auth/login?redirect=${encodeURIComponent(
    evaluationHref
  )}`;

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setQuestions([]);

        // 국가 ID 기준으로 진단평가 문제를 조회
        const result = await getDiagnosisQuestions(
          countryId,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setQuestions(result);

        // API는 성공했지만 등록된 문제가 없는 경우
        if (result.length === 0) {
          setErrorMessage(
            "아직 이 국가의 진단평가 문제가 준비되지 않았습니다."
          );
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("[diagnosis] 진단평가 문제 조회 실패:", error);

        if (error instanceof ApiRequestError) {
          if (error.status === 401) {
            setIsLoginModalOpen(true);
            return;
          }

          // 해당 국가의 진단평가 문제가 없는 경우
          if (error.status === 404) {
            setErrorMessage(
              "아직 이 국가의 진단평가 문제가 준비되지 않았습니다."
            );
            return;
          }

          if (error.status && error.status >= 500) {
            setErrorMessage(
              "잠시 후 다시 시도해 주세요. 진단평가 정보를 불러오지 못했습니다."
            );
            return;
          }

          setErrorMessage(
            error.message || "진단평가 정보를 불러오지 못했습니다."
          );
          return;
        }

        // 네트워크 오류 등 ApiRequestError가 아닌 예외 처리
        setErrorMessage("네트워크 상태를 확인한 뒤 다시 시도해 주세요.");
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
  }, [countryId, retryCount]);

  // 다시 시도 버튼 클릭 시 API 재요청
  const handleRetry = () => {
    setRetryCount((current) => current + 1);
  };

  // 로그인 안내 모달에서 확인 클릭
  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    router.push(loginHref);
  };

  // 로그인 안내 모달에서 취소 클릭
  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
    router.push(courseListHref);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FA]">
        <p className="text-sm font-medium text-[#8A9BB0]">
          진단평가 문제를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (errorMessage && questions.length === 0) {
    return (
      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
        <section className="w-full max-w-md rounded-2xl border border-[#E3EDF3] bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            진단평가를 시작할 수 없습니다
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6B7684]">
            {errorMessage}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.push(courseListHref)}
              className="h-11 flex-1 rounded-xl border border-[#D9E2EA] bg-white text-sm font-bold text-[#526173]"
            >
              강의 목록으로
            </button>

            <button
              type="button"
              onClick={handleRetry}
              className="h-11 flex-1 rounded-xl bg-[#439A97] text-sm font-bold text-white"
            >
              다시 시도
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <EvaluationForm
        continentCode={pathContinentCode}
        countryId={countryId}
        questions={questions}
      />

      <Modal
        open={isLoginModalOpen}
        title="로그인이 필요합니다"
        description={
          "진단평가를 응시한 뒤 결과에 맞는 강의와 패키지 라운지를 이용할 수 있어요.\n로그인 후 진단평가를 계속 진행해 주세요."
        }
        confirmText="로그인하기"
        cancelText="돌아가기"
        onConfirm={handleLoginConfirm}
        onCancel={handleLoginCancel}
      />
    </>
  );
}