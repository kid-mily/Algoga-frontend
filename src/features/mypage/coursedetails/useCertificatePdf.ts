"use client";

import { useEffect, useState } from "react";
import type { CertificatePdfData } from "../types";
import { getCertificatePdf } from "@/features/services/certificate.service";

export function useCertificatePdf(courseId: number) {
  const [certificatePdf, setCertificatePdf] = useState<CertificatePdfData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let pdfUrl = "";
    let isCancelled = false;

    const fetchCertificatePdf = async () => {
      if (!Number.isInteger(courseId) || courseId <= 0) {
        setErrorMessage("올바르지 않은 강의 번호입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const pdfFile = await getCertificatePdf(courseId);
        if (isCancelled) return;

        pdfUrl = URL.createObjectURL(pdfFile.blob);
        setCertificatePdf({ ...pdfFile, url: pdfUrl });
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "수료증 PDF를 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void fetchCertificatePdf();
    return () => {
      isCancelled = true;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [courseId]);

  return { certificatePdf, isLoading, errorMessage };
}
