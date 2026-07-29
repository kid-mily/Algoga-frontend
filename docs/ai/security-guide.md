# Security Guide

민감 정보 취급 규칙입니다. AI 도구와 작업자 모두 지켜야 합니다.

## 커밋 금지 (절대)

아래는 **저장소에 커밋/푸시하지 않습니다.**

- `.env`, `.env.*` 등 환경변수 파일
- 인증 토큰 / 액세스 토큰 / 리프레시 토큰
- 인증 쿠키 값, 세션 값
- 실제 API base URL 중 비공개인 것, 내부 엔드포인트
- API 키 / secret / 비밀번호 / 인증서 / private key

> 실수로 커밋했다면 즉시 팀에 알리고 값을 **폐기/재발급**하세요. 히스토리에 남으면 삭제해도 유출로 간주합니다.

## 문서/코드에 값 쓰지 않기

- 이 문서를 포함한 어떤 MD/코드에도 **실제 secret 값을 적지 마세요.**
- 대신 **환경변수 이름과 용도만** 적습니다.

### 환경변수 (이름/용도만)

코드 스캔으로 정리한 실제 사용 변수입니다. 로컬 세팅 시 `.env.local`에 아래 변수들을 채워 넣으세요.

#### 클라이언트 노출 (`NEXT_PUBLIC_`) — 비밀 값 금지

| 이름 | 용도 | 사용처 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | 백엔드 API base URL | `src/lib/api.ts`, `src/features/services/*`, 채팅 소켓 훅 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (SEO/메타데이터, 허용 dev origin) | `src/features/seo/site.ts`, `next.config.ts` |
| `NEXT_PUBLIC_PORTONE_STORE_ID` | PortOne 결제 store id | `src/features/services/portone.service.ts` |
| `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` | PortOne 결제 channel key | `src/features/services/portone.service.ts` |

#### 서버 전용 (접두사 없음, 브라우저 미노출)

| 이름 | 용도 | 사용처 |
| --- | --- | --- |
| `API_PROXY_TARGET` | API 프록시 대상 백엔드 주소 | `src/app/api/[...path]/route.ts`, `next.config.ts` |

#### E2E 테스트용 (Playwright, 로컬/CI 전용) — **실제 계정 자격증명, 커밋 금지**

| 이름 | 용도 | 사용처 |
| --- | --- | --- |
| `E2E_CHAT_USER_A_USERNAME` / `..._PASSWORD` | E2E 테스트 계정 A | `tests/checkout.spec.ts` |
| `E2E_CHAT_USER_B_USERNAME` / `..._PASSWORD` | E2E 테스트 계정 B | `tests/checkout.spec.ts` |

#### 직접 설정하지 않는 변수

- `ANALYZE` — 번들 분석 토글(`npm run analyze`가 자동 설정), `NODE_ENV` — Next/도구가 관리(수동 설정 금지), `CI` — CI 환경이 자동 설정.

> 참고: `.gitignore`가 `.env*`를 무시하므로 실제 값이 담긴 파일은 커밋되지 않습니다. 위 표는 **이름과 용도만** 기록하며, 실제 값은 `.env.local`(커밋 안 됨)에 둡니다.

## Next.js 주의

- `NEXT_PUBLIC_` 접두사가 붙은 변수는 **브라우저 번들에 그대로 포함**됩니다. 비밀 값은 절대 이 접두사로 두지 마세요.
- 서버 전용 secret은 접두사 없는 변수로 서버 코드(route handler, server component 등)에서만 사용합니다.

## 그 밖에

- 토큰/쿠키 처리는 기존 클라이언트/인터셉터(`src/lib/`)를 통해서만. 로그에 토큰·개인정보를 출력하지 마세요.
- 외부 서비스로 코드/데이터를 보낼 때는 민감 정보 포함 여부를 먼저 확인합니다.
