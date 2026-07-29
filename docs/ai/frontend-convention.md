# Frontend Convention

React + Next.js + TypeScript + Tailwind CSS 기준 프론트 작업 규칙입니다.
**코드를 쓰기 전에, 이미 있는 코드/폴더 구조/스타일을 먼저 확인**하고 그 패턴을 따르세요.

> ⚠️ 네이밍/커밋/브랜치 등 **팀 공통 규칙은 [`README.md`](../../README.md)** 를 따릅니다.
> 단, README의 **폴더 구조(§4)와 CSS 규칙(§3)은 구식**입니다(`pages/`·`store/`·`styles/`, "CSS 파일 연결"). 실제 코드는 아래대로 **App Router + `src/features` + Tailwind + 전역상태 없음**이며, 충돌 시 **실제 코드와 이 문서를 우선**하세요. (README §3·§4는 팀이 별도로 갱신 필요)

## Tech Stack

- React + Next.js (App Router — `src/app/`)
- TypeScript
- npm
- Tailwind CSS
- **fetch 기반 커스텀 API 클라이언트** (`src/lib/api.ts`)
- **별도 전역 상태관리 라이브러리 없음** (Redux/Zustand/Recoil 등 도입 금지, 팀 합의 없이 추가하지 말 것)

## Commands

```bash
npm run dev    # next dev -p 17000
npm run build
npm run lint
```

로컬 개발 서버 포트: **17000**

## 폴더 구조 확인 규칙 (먼저 할 것)

- 새 파일을 만들기 전에 유사한 기존 기능이 어디에 있는지 찾아보고 **같은 위치/같은 패턴**을 따르세요.
- 기능 코드는 `src/features/<feature>/` 아래에 모읍니다. 일반적으로:
  - `components/` — UI 컴포넌트
  - `hooks/` — 커스텀 훅
  - `utils/` — 순수 유틸/헬퍼
  - `types.ts` — 타입 정의
- 라우팅/페이지는 `src/app/` (App Router). 공용 로직/클라이언트는 `src/lib/`.
- 새 최상위 폴더나 새 패턴을 만들기 전에 기존 관례를 먼저 확인하고, 애매하면 팀에 확인하세요.

## 컴포넌트 작성 규칙

- 기존 컴포넌트의 **네이밍, 파일 분리 방식, props 타이핑, 서버/클라이언트 컴포넌트 구분**을 먼저 확인하고 맞추세요.
- 클라이언트 상호작용/상태/이벤트가 필요한 컴포넌트에만 `"use client"`를 붙입니다. 불필요하게 붙이지 마세요.
- 전역 상태 라이브러리가 없으므로 상태는 **로컬 상태 + props + (필요 시) Context / URL / 서버 데이터**로 관리합니다.
- 컴포넌트에 비즈니스 로직을 몰아넣지 말고, 재사용 로직은 `hooks/`·`utils/`로 분리합니다.

## API 호출 규칙

- **반드시 기존 커스텀 API 클라이언트(`src/lib/api.ts`)를 사용**합니다. `fetch`/`axios`를 직접 새로 쓰거나 두 번째 클라이언트를 만들지 마세요(팀 합의 없이 금지).
- 인증/토큰 처리는 기존 클라이언트/인터셉터(`src/lib/interceptors.ts`, `src/lib/auth.ts`, `src/lib/cookie.ts`)를 통해 처리합니다. 직접 토큰을 다루지 마세요.
- 응답 언래핑은 `unwrapData`, 에러는 `ApiRequestError` 패턴을 따릅니다.
- 요청/응답 타입은 해당 기능의 `types.ts` 또는 저장소의 기존 관례에 맞춰 API 모듈 근처에 둡니다.
- 전체 API 레퍼런스는 백엔드 **Swagger**, 최근 변경은 백엔드 `.ai/API.md` 또는 PR `Frontend Impact`를 확인합니다.
- 프론트가 실제 사용하는 엔드포인트는 [`.ai/API.md`](../../.ai/API.md)에 정리합니다.

## Tailwind 스타일 규칙

- 스타일은 **Tailwind CSS 유틸리티 클래스**로 작성합니다.
- 기존의 **간격/색상/타이포/컴포넌트 패턴**을 먼저 확인하고 재사용하세요. 임의의 값(magic number)보다 기존 스케일을 우선.
- 새 스타일링 라이브러리(styled-components, emotion 등)를 팀 합의 없이 도입하지 마세요.
- 반복되는 className 조합은 컴포넌트로 추출하거나 저장소의 기존 유틸 방식을 따릅니다.

## 기타

> TODO: 팀 확인 필요 — ESLint/Prettier 외 추가 코드 스타일 규칙, import 정렬 규칙, 절대경로 alias(`@/`) 사용 범위 등이 있으면 여기에 정리.
