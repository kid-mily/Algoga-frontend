import { cookies } from "next/headers";

// 서버 컴포넌트에서 로그인 사용자 전용 API를 호출할 때, 브라우저의 쿠키 자동 전송(credentials:
// "include")이 서버에는 적용되지 않으므로 들어온 요청의 쿠키를 그대로 실어 보내기 위한 헤더.
export async function getServerAuthHeaders(): Promise<HeadersInit | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}
