# STATE

이 파일은 **팀 전체 상태판이 아닙니다.**
**현재 AI-assisted 프론트 작업의 상태만** 기록합니다. (진행 중인 한 가지 흐름 기준)

> 여러 작업이 동시에 진행되면, 마지막으로 손댄 작업 기준으로 갱신하세요.
> 자세한 인수인계는 [`HANDOFF.md`](HANDOFF.md), 완료 기록은 [`WORKLOG.md`](WORKLOG.md).

---

## 현재 작업

- AI 일정 추천(`/aischedule`) 페이지 신규 구현. 사용자 제공 API 명세(`itineraries/recommend` 등) 기준으로 프론트 전체를 새로 만듦

## 현재 브랜치

- `feature/ai-recommendation#608` (커밋 없음 — working tree에 변경사항 그대로 있음, `git status --porcelain`으로 확인)

## 진행 상황

- [x] 여행 유형 3-모드(구매한 여행/전체 패키지/자유 여행) 선택 UI
- [x] `POST /itineraries/recommend` 연동 (60초 타임아웃)
- [x] `GET /itineraries/purchased-trips`, `GET /packages`(전체 카탈로그, 신규) 연동해 선택 목록 구성
- [x] 결과 화면(일자별 오전/오후/저녁 카드, 예상 비용, AI 코멘트) 구현
- [x] 서버 규칙과 동일한 프론트 선검증 + errorCode(ITN_001~007)별 안내
- [x] 내 일정 추천 이력 목록(`GET /itineraries`)/상세(`GET /itineraries/{id}`) 페이지
- [x] typecheck/lint 통과, 브라우저로 탭 전환·폼 검증·401 처리 확인
- [ ] **로그인 후 실제 API 응답으로 검증 — 아직 안 됨** (이 세션엔 로그인 자격 증명이 없어서 실제 추천 생성 성공 케이스를 한 번도 못 봄)
- [ ] 위 변경사항 전부 **아직 커밋 안 됨**

## 다음 할 일

- 로그인 후 브라우저에서 실제 확인: (1) 3가지 tripType 모두 추천 생성 성공, (2) 응답 필드가 `src/features/aischedule/types.ts`의 타입과 정확히 일치하는지, (3) 이력 목록/상세 정상 표시
- 실제 응답이 명세와 다르면 타입/컴포넌트 먼저 맞추고 나서 진행
- 확인되면 커밋 (사용자가 직접 진행 — AI는 git push/커밋 안 함)

## 주의사항

- 이 세션에서 로그인 자격 증명이 없어 실제 추천 생성 흐름을 브라우저로 직접 확인하지 못했음 — 사용자 확인 필요
- `src/lib/api.ts`는 공통 파일이라 건드리지 않음 (사용자 지시)
- `tripType`별로 식별자(`bookingId`/`packageId`/`destination`+기간)를 정확히 하나만 보내야 함
- 깃허브(커밋 push / PR / issue) 절대 건드리지 말 것 — 사용자 지시

---

_최종 갱신: 2026-07-21 / 작성자(도구): Claude Code_
