import type { IMessage } from "@stomp/stompjs";

// useChatSocket(방별 소켓)과 useChatNotificationSocket(알림 소켓)이 공유하는 STOMP 연결 헬퍼
export const getWebSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");
  }

  const url = new URL(apiUrl);
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
