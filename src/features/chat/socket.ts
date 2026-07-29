import type { IMessage } from "@stomp/stompjs";

// useChatSocket(방별 소켓)과 useChatNotificationSocket(알림 소켓)이 공유하는 STOMP 연결 헬퍼
//
// NEXT_PUBLIC_API_URL은 로컬에서 REST 프록시(src/app/api/[...path]/route.ts)를 타는 로컬 주소
// (예: http://localhost:17000)라 WebSocket에는 쓸 수 없습니다. Route Handler는 upgrade 요청을
// 프록시하지 못해서, 이 주소로 붙으면 STOMP 브로커가 없는 곳에 연결 시도만 반복하게 됩니다.
// 그래서 WS는 항상 실제 백엔드(NEXT_PUBLIC_BACKEND_URL)로 직접 연결합니다.
export const getWebSocketUrl = () => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!backendUrl) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_URL(또는 NEXT_PUBLIC_API_URL) 환경변수가 설정되지 않았습니다."
    );
  }

  const url = new URL(backendUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/chat";
  url.search = "";

  return url.toString();
};

export const parseBody = (message: IMessage): unknown => {
  try {
    return JSON.parse(message.body) as unknown;
  } catch {
    return null;
  }
};
