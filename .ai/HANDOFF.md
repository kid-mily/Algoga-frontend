# HANDOFF

새 채팅 / 다른 AI 도구 / 다른 작업자에게 작업을 넘길 때 쓰는 **인수인계 양식**입니다.
넘기기 직전에 아래를 채워 주세요. 받는 쪽은 이 파일과 [`STATE.md`](STATE.md)를 먼저 읽습니다.

---

## 현재 목표

- AI 일정 추천(`/aischedule`) 기능 구현. 기존엔 `"ai 일정 추천"` 텍스트만 있는 빈 페이지였음
- 사용자가 제공한 API 명세(하단 참고) 기준으로 프론트 전체를 신규 구현 완료
- 브랜치: `feature/ai-recommendation#608`

## 완료한 작업

- 여행 유형 3-모드 선택: 구매한 여행(`BOOKING`) / 전체 패키지(`PACKAGE`) / 자유 여행(`FREE`)
- 공통 입력 폼: 여행 취향(다중선택)/목적/동행자/예산/인원수
- `POST /itineraries/recommend` 연동 (AI 생성이라 60초 타임아웃)
- 결과 화면: 일자별 오전/오후/저녁 슬롯 카드, 예상 비용(`packagePrice`+`foodCost`=`totalEstimated`), AI 코멘트
- 서버 규칙과 동일한 프론트 선검증(ITN_002/003/005/006에 대응) + errorCode별 에러 문구
- 내 일정 추천 이력 목록(`/aischedule/history`) + 상세(`/aischedule/history/{id}`)
- `GET /packages`(전체 카탈로그, 나라 필터 없음) 신규 연동 — "전체 패키지" 선택지용

## 수정/신규 파일

- `src/features/aischedule/` (신규 폴더 전체)
  - `types.ts` — enum(TripType/TravelPreference/TravelPurpose/Companion) + label 맵, 요청/응답 타입
  - `hooks/useItineraryRecommend.ts` — 폼 상태 + 선검증 + 제출/에러 처리
  - `components/` — `TripTypeTabs`, `PurchasedTripPicker`, `PackagePicker`, `FreeTripForm`, `PreferenceForm`, `ItineraryResultView`, `ItineraryLoadingState`, `AiScheduleClient`, `ItineraryHistoryList`, `ItineraryDetailClient`
- `src/features/services/itinerary.service.ts` (신규) — `recommendItinerary`/`getPurchasedTrips`/`getMyItineraries`/`getItineraryDetail`
- `src/features/services/package.service.ts` — `getAllPackages` 추가
- `src/app/(user)/aischedule/page.tsx` — 플레이스홀더 대체
- `src/app/(user)/aischedule/history/page.tsx`, `src/app/(user)/aischedule/history/[id]/page.tsx` (신규)
- `.ai/API.md` — 새 엔드포인트 4개 문서화
- 전부 **커밋 안 됨** (`feature/ai-recommendation#608` 브랜치, working tree에 그대로 있음)

## 남은 작업

- [ ] **로그인 후 실제 API 응답으로 검증** — 이 세션엔 로그인 자격 증명이 없어서 브라우저로는 401 처리 경로만 확인했고, 실제 추천 생성 성공 케이스는 한 번도 못 봄. 응답 필드명이 명세와 정확히 일치하는지(특히 `estimatedCost`, `days[].slots[]`) 실제 호출로 재확인 필요
- [ ] `GET /packages`(전체 카탈로그) 응답이 정말 페이지네이션 없이 전부 내려오는지 확인 — 패키지 개수가 많아지면 `PackagePicker.tsx`에 페이지네이션/검색 추가 검토
- [ ] `PurchasedTripPicker`/`PackagePicker` 선택 목록이 길어질 때의 무한스크롤·검색 — 지금은 단순 목록(패키지는 `max-h-80 overflow-y-auto`만 적용)
- [ ] 히스토리 목록에서 "삭제" 기능 — 명세에 없어서 구현 안 함 (필요하면 백엔드 확인 후 추가)
- [ ] `estimatedCost.packagePrice`가 `null`(자유여행)일 때의 결과 화면 표시는 코드상 분기만 해뒀고 실제 화면으로 확인은 못함
- [ ] 확인되면 커밋 (AI는 git push/커밋 안 함, 사용자가 직접 — 이전에도 이 방식으로 진행함)

## 실행한 검증

- [x] `tsc --noEmit` (통과, `.next/types/validator.ts`의 무관한 캐시 오류 1개는 브랜치 전환 잔재라 무시 가능)
- [x] `npm run lint` / `npx eslint` (신규 파일 전부 에러·경고 없음)
- [x] 브라우저: `/aischedule` 렌더링, 3-모드 탭 전환(구매한 패키지/전체 패키지/자유 여행), 폼 선검증 메시지("목적지와 여행 기간을 입력해 주세요" 등) 정상 동작 확인
- [x] 브라우저: `/aischedule/history` 렌더링, 로그인 없을 때 401 → 에러 문구로 정상 처리(크래시 없음) 확인
- [ ] 로그인 계정으로 실제 추천 생성 흐름 — **미완료**
- [ ] `npm run build`
- [ ] test

## 주의사항 / 함정

- **깃허브(커밋 push, PR, issue 생성)는 AI가 하지 않음** — 사용자가 직접 진행하는 방식으로 이 프로젝트를 진행해왔음
- `src/lib/api.ts`는 공통 파일이라 수정 안 함
- `tripType`별로 `bookingId`/`packageId`/`destination`+기간 중 **정확히 하나만** 보내야 함(`recommendItinerary` 호출부, `useItineraryRecommend.ts`의 payload 조립 로직 참고) — 나머지는 보내도 무시된다고 명세에 있지만 프론트는 아예 안 보내도록 구현함
- `POST /itineraries/recommend`는 응답이 수 초~수십 초 걸릴 수 있어 `timeoutMs: 60000`으로 호출 중 (`itinerary.service.ts`) — 기본 15초(`lib/api.ts`)보다 김
- errorCode 매핑은 `ITN_001`(503, AI 서버 지연)만 프론트에서 문구를 오버라이드하고, 나머지(`ITN_002`~`ITN_007`)는 서버 `message`를 그대로 표시 — 서버 메시지가 바뀌면 화면 문구도 그대로 바뀜
- 이 세션엔 로그인 가능한 테스트 계정이 없어서 **실제 API 응답 구조 검증을 한 번도 못 했음** — 명세 문서 그대로 타입을 짰지만, 실제 응답이 명세와 다르면(특히 nullable 필드, 배열 vs 단일 객체 등) 런타임 에러 가능성 있음. 새 세션에서 가장 먼저 실제 호출 한 번 해보고 타입 어긋나는 부분부터 고치는 게 안전함

## 먼저 볼 파일

- `AGENTS.md`
- `.ai/API.md` (새 엔드포인트 4개 섹션 + 2026-07-21 변경 이력)
- `src/features/aischedule/types.ts` (API 명세를 그대로 옮긴 타입 — 실제 응답과 대조할 기준점)
- `src/features/aischedule/hooks/useItineraryRecommend.ts`
- `src/features/aischedule/components/AiScheduleClient.tsx`
- `src/features/services/itinerary.service.ts`

---

_작성: 2026-07-21 / 작성자(도구): Claude Code_
