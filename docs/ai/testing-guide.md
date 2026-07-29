# Testing Guide

변경 후 검증하는 방법입니다. **변경 유형에 맞는 것만** 실행하세요.

## 기본 명령어

```bash
npm run dev     # 로컬 개발 서버 (next dev -p 17000) — 포트 17000
npm run build   # 프로덕션 빌드 확인
npm run lint    # ESLint
```

로컬 개발 서버 포트: **17000** → http://localhost:17000

## 저장소에 정의된 테스트 명령어

`package.json`에 아래 스크립트가 존재합니다:

```bash
npm run test          # playwright test (E2E)
npm run test:ui       # playwright test --ui
npm run test:unit     # jest (단위 테스트)
npm run test:unit:watch
```

> TODO: 팀 확인 필요 — 위 명령 중 **어떤 것을 언제 필수로 돌려야 하는지**(PR 전 필수 여부, CI에서 도는 범위, Playwright 실행 전 선행 조건 등)가 아직 확정되지 않았습니다. 확정 전까지는 아래 "변경 유형별 가이드"를 기본으로 사용하세요.

## 변경 유형별 가이드

| 변경 유형 | 실행 |
| --- | --- |
| 스타일/마크업만 (Tailwind, 텍스트) | `npm run lint` + `npm run dev`로 화면 확인 |
| 컴포넌트/훅 로직 | `npm run lint` + `npm run dev` 동작 확인 (+ 관련 `npm run test:unit`) |
| API 연동 변경 | `npm run lint` + `npm run dev`로 실제 호출/에러 처리 확인 (+ 해당 시 `npm run test`) |
| 라우팅/빌드 영향 가능 변경 | `npm run lint` + `npm run build` |
| 배포 전 / 큰 변경 | `npm run lint` + `npm run build` (+ 팀 확정 시 test) |

## 원칙

- 실패한 검증은 숨기지 말고 결과(에러 출력)를 그대로 공유합니다.
- 실행하지 못한 검증은 "미실행"으로 남깁니다.
- 어떤 검증을 돌렸는지 [`.ai/HANDOFF.md`](../../.ai/HANDOFF.md) / [`.ai/WORKLOG.md`](../../.ai/WORKLOG.md)에 기록하세요.
