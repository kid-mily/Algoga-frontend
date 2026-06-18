import { CertificatePdfFile } from "../mypage/types";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getFileName(contentDisposition: string | null, courseId: number) {
  if (!contentDisposition) {
    return `certificate-course-${courseId}.pdf`;
  }

  // 한글 등 UTF-8 파일명 처리
  const encodedFileName = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (encodedFileName?.[1]) {
    return decodeURIComponent(encodedFileName[1]);
  }

  // 일반 파일명 처리
  const normalFileName = contentDisposition.match(
    /filename="?([^"]+)"?/i
  );

  return normalFileName?.[1] ?? `certificate-course-${courseId}.pdf`;
}

export async function getCertificatePdf(
  courseId: number
): Promise<CertificatePdfFile> {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/api/v1/courses/${courseId}/certificate`,
    {
      method: "GET",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    }
  );

  if (!response.ok) {
    throw new Error("수료증 PDF를 불러오지 못했습니다.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/pdf")) {
    throw new Error("PDF 형식의 응답이 아닙니다.");
  }

  const blob = await response.blob();

  const fileName = getFileName(
    response.headers.get("content-disposition"),
    courseId
  );

  return {
    blob,
    fileName,
  };
}