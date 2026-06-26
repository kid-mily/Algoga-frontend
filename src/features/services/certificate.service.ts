import { CertificatePdfFile } from "@/features/mypage/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const getFileName = (
  contentDisposition: string | null,
  courseId: number
) => {
  const defaultName =
    `certificate-course-${courseId}.pdf`;

  if (!contentDisposition) {
    return defaultName;
  }

  const encodedFileName =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i
    );

  if (encodedFileName?.[1]) {
    try {
      return decodeURIComponent(
        encodedFileName[1]
      );
    } catch {
      return encodedFileName[1];
    }
  }

  const normalFileName =
    contentDisposition.match(
      /filename="?([^";]+)"?/i
    );

  return normalFileName?.[1] ?? defaultName;
};

export async function getCertificatePdf(
  courseId: number
): Promise<CertificatePdfFile> {
  if (
    !Number.isInteger(courseId) ||
    courseId <= 0
  ) {
    throw new Error(
      "강의 번호가 올바르지 않습니다."
    );
  }

  const response = await fetch(`${API_URL}/api/v1/courses/${courseId}/certificate`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/pdf",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "로그인 후 수료증을 확인할 수 있습니다."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "수료증을 조회할 권한이 없습니다."
      );
    }

    if (response.status === 404) {
      throw new Error(
        "발급된 수료증을 찾을 수 없습니다."
      );
    }

    throw new Error(
      "수료증 PDF를 불러오지 못했습니다."
    );
  }

  const contentType =
    response.headers.get("content-type");

  if (
    !contentType?.includes("application/pdf")
  ) {
    throw new Error(
      "수료증 응답이 PDF 형식이 아닙니다."
    );
  }

  const blob = await response.blob();

  return {
    blob,
    fileName: getFileName(
      response.headers.get(
        "content-disposition"
      ),
      courseId
    ),
  };
}
