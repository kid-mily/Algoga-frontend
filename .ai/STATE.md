# STATE

이 파일은 **팀 전체 상태판이 아닙니다.**
**현재 AI-assisted 프론트 작업의 상태만** 기록합니다. (진행 중인 한 가지 흐름 기준)

> 여러 작업이 동시에 진행되면, 마지막으로 손댄 작업 기준으로 갱신하세요.
> 자세한 인수인계는 [`HANDOFF.md`](HANDOFF.md), 완료 기록은 [`WORKLOG.md`](WORKLOG.md).

---

## 현재 작업

- 커뮤니티 목록 "내가 쓴 글" 체크 필터 연동 (체크 상태에 따라 `/api/v1/posts` ↔ `/api/v1/users/me/posts` 호출 전환)

## 현재 브랜치

- `fix/user-community#476`

## 진행 상황

- [x] `types.ts` → `types/` 폴더 도메인별 분리 (category/post/comment/reaction/report/common) + 죽은 타입 제거 + 중복 타입 정리
- [x] `getMyCommunityPosts` 서비스 함수 추가, `CommunityPageClient`/`CommunityHeader`/`CommunityCategory`에 "내가 쓴 글" 체크박스 및 나라 필터 비활성화 로직 연동
- [x] `tsc --noEmit`, `npm run lint` 확인
- [ ] 로컬 브라우저에서 실제 토글 동작 및 `/api/v1/users/me/posts` 응답 시각 확인 (Chrome 확장 연결 실패로 미완료)

## 다음 할 일

- `npm run dev`(포트 17000)로 "내가 쓴 글" 체크박스 토글 → 네트워크 탭에서 API 전환 확인
- 백엔드에 `GET /api/v1/users/me/posts`가 가이드대로 실제 구현되어 있는지 확인

## 주의사항

- 깃허브(커밋 push / PR / issue) 절대 건드리지 말 것 — 사용자 지시
- "내가 쓴 글" API는 나라(countryId) 필터 미지원 → 체크 시 나라 탭은 비활성화만 하고 숨기지는 않음
- 브라우저 시각 검증은 Chrome 확장 연결 문제로 아직 못 함

---

_최종 갱신: 2026-07-11 / 작성자(도구): Claude Code_
