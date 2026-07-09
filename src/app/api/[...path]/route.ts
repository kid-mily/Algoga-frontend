// 로컬에서 로그인 되게 하려고 만든 코드
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getApiProxyTarget = () => {
  const proxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, "");

  if (!proxyTarget) {
    throw new Error("API_PROXY_TARGET 환경변수가 설정되지 않았습니다.");
  }

  return proxyTarget;
};

const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

const getSetCookieHeaders = (headers: Headers) => {
  const headersWithCookies = headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithCookies.getSetCookie === "function") {
    return headersWithCookies.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  if (!setCookie) return [];

  return setCookie.split(/,(?=\s*[^;,]+=)/);
};

const rewriteCookieForLocalhost = (cookie: string, hostname: string) => {
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  let nextCookie = cookie.replace(/;\s*Domain=[^;]*/gi, "");

  if (isLocalhost) {
    nextCookie = nextCookie
      .replace(/;\s*Secure/gi, "")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
  }

  return nextCookie;
};

const createProxyHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);

  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));

  return headers;
};

const createResponseHeaders = (backendHeaders: Headers, requestHostname: string) => {
  const headers = new Headers(backendHeaders);
  const setCookies = getSetCookieHeaders(backendHeaders);

  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  headers.delete("set-cookie");

  setCookies.forEach((cookie) => {
    headers.append("set-cookie", rewriteCookieForLocalhost(cookie, requestHostname));
  });

  return headers;
};

async function proxyApi(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(`${getApiProxyTarget()}/api/${path.join("/")}`);
  targetUrl.search = requestUrl.search;

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers: createProxyHeaders(request),
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: createResponseHeaders(backendResponse.headers, requestUrl.hostname),
  });
}

export {
  proxyApi as DELETE,
  proxyApi as GET,
  proxyApi as PATCH,
  proxyApi as POST,
  proxyApi as PUT,
};
