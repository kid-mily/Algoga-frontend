# AGENTS.md

이 파일은 **모든 AI 도구(Claude Code, Codex 등)가 가장 먼저 읽는 메인 진입점**입니다.
규칙은 여기서 관리하고, 세부 내용은 아래 문서로 위임합니다. 문서를 중복 작성하지 마세요.

## 0. 시작 규칙 (가장 중요)

1. **먼저 작업 요청을 분류**하고, **필요한 문서만** 읽습니다. 전부 읽지 마세요.
2. 코드를 작성/수정하기 전에 **기존 폴더 구조, 컴포넌트 스타일, 네이밍, Tailwind 규칙을 먼저 확인**합니다.
3. 백엔드 동작이 불확실하면 **Swagger를 확인하거나 백엔드 담당자에게 질문**합니다. 추측으로 API를 만들지 마세요.
4. 변경 후에는 가능하면 **lint / build / (해당되면) test**를 실행합니다.
5. **기존 코드 파일을 함부로 수정하지 말고**, 요청 범위 안에서만 작업합니다.

## 1. 작업 유형 분류 → 읽을 문서

### 프론트 작업 (페이지 / 컴포넌트 / 훅 / 스타일 / 라우팅 / UI 상태)

- **필수**: [`docs/ai/frontend-convention.md`](docs/ai/frontend-convention.md)

### API 연동 작업 (fetch, 커스텀 API 클라이언트, 요청/응답 매핑, 에러 처리, 인증/토큰)

- **필수**: [`.ai/API.md`](.ai/API.md)
- **필수**: [`docs/ai/frontend-convention.md`](docs/ai/frontend-convention.md)

### 이어서 하는 작업 ("이어서", "어디까지 했어", "현재 상태 알려줘")

- **필수**: [`.ai/STATE.md`](.ai/STATE.md)
- **필수**: [`.ai/HANDOFF.md`](.ai/HANDOFF.md)

### Git / 이슈 / PR 작업

- **팀 규칙 단일 출처**: [`README.md`](README.md) (브랜치/커밋/버전/릴리즈 규칙)
- AI 요점 + API 연동 규칙: [`docs/ai/git-issue-pr-guide.md`](docs/ai/git-issue-pr-guide.md)

### 테스트 / 실행 / 빌드 확인

- [`docs/ai/testing-guide.md`](docs/ai/testing-guide.md)

### 보안 관련 (env, 토큰, secret, 커밋 주의)

- [`docs/ai/security-guide.md`](docs/ai/security-guide.md)

> 여러 유형에 걸치면 해당 문서를 모두 읽습니다. (예: API 연동 프론트 작업 → convention + API.md)

## 2. 기술 스택 요약

- Framework: **React + Next.js**
- Language: **TypeScript**
- Package manager: **npm**
- Global state: **별도 전역 상태관리 라이브러리 없음**
- API: **fetch 기반 커스텀 API 클라이언트** (`src/lib/api.ts`)
- Styling: **Tailwind CSS**
- Dev command: `npm run dev` (`next dev -p 17000`)
- Build command: `npm run build`
- Lint command: `npm run lint`
- Local dev server port: **17000**

## 3. 작업 완료 시 (필요할 때만 갱신)

작업이 끝나면 아래를 **필요한 경우에만** 갱신합니다. 매번 전부 갱신할 필요는 없습니다.

- 기록을 남기고 싶으면 → [`.ai/WORKLOG.md`](.ai/WORKLOG.md)
- 현재 작업 상태가 바뀌었으면 → [`.ai/STATE.md`](.ai/STATE.md)
- API 연동이 바뀌었으면 → [`.ai/API.md`](.ai/API.md)
- 다른 사람/새 채팅에 넘길 거면 → [`.ai/HANDOFF.md`](.ai/HANDOFF.md)

## 4. 도구별 참고

- **Claude Code**: [`CLAUDE.md`](CLAUDE.md)는 이 파일을 가리키는 포인터입니다. 규칙은 여기(AGENTS.md)를 따릅니다.
- **Codex** 및 기타 AI 도구: 이 파일을 기준 문서로 사용하세요.

> TODO: 팀 확인 필요 — 이 저장소에서 실제로 사용하는 AI 도구 목록과, 도구별 추가 규칙이 있으면 여기에 정리.
