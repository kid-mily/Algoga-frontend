# Git / Issue / PR Guide

**팀의 Git 규칙 단일 출처는 저장소 루트의 [`README.md`](../../README.md) 입니다.**
브랜치/커밋/버전/릴리즈 규칙은 README를 따르세요. 이 문서는 **중복 작성하지 않고**,
AI가 놓치기 쉬운 요점과 API 연동 관련 규칙만 짚습니다.

## README에서 반드시 확인할 것

- **브랜치 명명** (README §1) — `main` / `develop` / `feature/작업내용` / `fix/작업내용`, 소문자+하이픈만, 이슈번호는 `feature/login-page-#12` 형식
- **커밋 메시지** (README §2) — `[type]: subject#이슈번호` (Conventional Commits). type: `feature` `fix` `style` `refactor` `test` `doc`. subject 50자 이내, 마침표 없이, 명령문
- **버전 / 릴리즈 / 태그** (README §5~) — `MAJOR.MINOR.PATCH`, `feature|fix|docs/* → develop → main`, 릴리즈노트는 `.github/release_note_template.md`

### 요점 (AI가 자주 틀리는 부분)

- 커밋 type은 `docs`가 아니라 **`doc`**. 형식은 `[doc]: 요약#474` 처럼 **콜론 + 공백 없이 `#번호`**.
- 브랜치명은 **영문**만. 역할 접두사는 camelCase (예: `feature/stuLogin-page`). 역할: user / contentM / csM / moneyM / dataM / superAdmin.
- 기본 대상 브랜치는 **`develop`** (main 직접 push 금지).

## PR 본문에 포함할 것

- 목적 / 변경 요약
- 관련 이슈 (`Closes #...`)
- 실행한 검증 (`npm run lint`, `npm run build`, 해당 시 test 결과)
- 스크린샷 (UI 변경 시)

> TODO: 팀 확인 필요 — PR 리뷰어 지정 규칙, 머지 전략(squash/rebase). (README에 명시되면 이 줄 삭제하고 README로 위임)

## API 연동 변경 시 (중요)

- API 연동이 바뀌는 PR이면, **백엔드 PR의 `Frontend Impact` 섹션 또는 Swagger를 먼저 확인**하고 필드/응답 형태를 맞춥니다.
- 프론트가 실제 사용하는 엔드포인트/변경 사항은 [`.ai/API.md`](../../.ai/API.md)에 반영합니다.
- 백엔드 변경 대기 중이면 PR 및 [`.ai/STATE.md`](../../.ai/STATE.md)에 명시합니다.
