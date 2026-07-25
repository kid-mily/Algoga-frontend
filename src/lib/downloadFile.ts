import { notifySessionExpired } from "@/lib/sessionExpiration";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type DownloadFileOptions = {
  params?: Record<string, string | number | boolean | undefined | null>;
  filename: string;
  accept?: string;
  errorMessage?: string;
  // true면 실패 응답의 JSON body에서 message를 읽어 에러로 던진다(없으면 errorMessage + status).
  errorFromResponse?: boolean;
};

// 관리자 파일 다운로드 공통 유틸.
// 인증 쿠키가 필요하고 응답이 파일(text/csv 등)이라 공통 API 클라이언트 대신 fetch를 직접 쓴다.
// (여러 관리자 서비스에 흩어져 있던 fetch→blob→objectURL→a 클릭→revoke 로직을 한곳으로 모음)
export const downloadAdminFile = async (
  path: string,
  {
    params,
    filename,
    accept = "text/csv",
    errorMessage = "CSV 다운로드에 실패했습니다.",
    errorFromResponse = false,
  }: DownloadFileOptions
) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { Accept: accept },
  });

  if (!response.ok) {
    if (response.status === 401) {
      notifySessionExpired("/auth/adminlogin");
    }

    if (errorFromResponse) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `${errorMessage} (status: ${response.status})`
      );
    }
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // 즉시 revoke하면 일부 브라우저에서 다운로드가 취소될 수 있어 다음 틱으로 미룬다.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
