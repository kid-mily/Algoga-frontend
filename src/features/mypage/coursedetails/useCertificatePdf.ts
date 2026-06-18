"use client";

import { useEffect, useState } from "react";

import { CertificatePdfData } from "../types";
import { getCertificatePdf } from "@/features/services/certificate.service";


export function useCertificatePdf(courseId: number) {
  const [certificatePdf, setCertificatePdf] =
    useState<CertificatePdfData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setErrorMessage("올바르지 않은 강의 번호입니다.");
      setIsLoading(false);
      return;
    }

    let pdfUrl = "";
    let isCancelled = false;

    const fetchCertificatePdf = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const pdfFile = await getCertificatePdf(courseId);

        if (isCancelled) {
          return;
        }

        pdfUrl = URL.createObjectURL(pdfFile.blob);

        setCertificatePdf({
          ...pdfFile,
          url: pdfUrl,
        });
      } catch (error) {
        console.error("수료증 PDF 조회 실패:", error);

        if (isCancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "수료증 PDF를 불러오지 못했습니다."
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchCertificatePdf();

    return () => {
      isCancelled = true;

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [courseId]);

  return {
    certificatePdf,
    isLoading,
    errorMessage,
  };
}