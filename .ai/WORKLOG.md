# WORKLOG

**완료된 작업을 날짜별로 기록**합니다. 최신 항목을 위로 추가하세요. (진행 중 상태는 [`STATE.md`](STATE.md))

---

## 2026-07-11 — 콘텐츠매니저 강의 수정 시 "최대 지급 마일리지" 미표시 방어 처리

### 작업 요약

- 강의 수정 페이지 진입 시 "최대 지급 마일리지" 입력값이 비어있는 문제 확인 요청
- 강의 상세 GET 응답의 `maxRewardMileage`를 그대로 읽는 코드는 정상이었으나, 이 저장소에서 마일리지 필드는 과거에도 여러 번(#59, #125, #172, #221, #281, #348) 백엔드 필드명(`mileage`/`maxRewardMileage`/snake_case) 불일치로 반복 수정된 이력이 있음
- `AdminCourseRecord`에 `country_id`/`is_public`/`thumbnail_url` 등은 snake_case 폴백이 있는데 마일리지만 없었던 게 비대칭 지점 → `getMaxRewardMileage()` 헬퍼로 `maxRewardMileage → max_reward_mileage → mileage → reward_mileage` 순으로 방어적으로 읽도록 보강
- **주의**: 실제 라이브 백엔드 응답의 정확한 필드명은 확인 못함(Swagger/네트워크탭 직접 확인 불가, 관리자 로그인 권한 없음) — 이번 변경은 방어적 보강이며 근본 원인 100% 확정은 아님

### 수정 파일

- `src/features/contentmanage/lecture/types.ts` — `AdminCourseRecord`에 `max_reward_mileage`, `reward_mileage` 필드 추가
- `src/features/contentmanage/lecture/utils/lectureFormatters.ts` — `getMaxRewardMileage()` 헬퍼 추가
- `src/features/contentmanage/lecture/components/EditLectureClient.tsx` — `lecture.maxRewardMileage` 직접 참조 → `getMaxRewardMileage(lecture)` 사용

### 실행한 검증

- `tsc --noEmit`: 통과 (기존 무관 에러 제외)
- `npm run lint` (해당 파일 한정): 통과
- 브라우저 시각 확인: **못함** — `/contentadmin/...` 접근에 관리자 로그인 필요, 계정 정보 없음

### 문제

- 실제로 백엔드가 어떤 케이스에서 snake_case로 내려주는지 재현/확인 못함

### 해결 방법

- 확정 원인 파악 전까지 방어적 폴백으로 우선 대응

### 다음 참고사항

- 여전히 안 보이면: 강의 상세 GET 응답 원문(Network 탭)을 그대로 공유 받아 실제 키 이름 확인 필요 (Swagger 확인 권장, AGENTS.md 규칙)
- 관리자 테스트 계정이 있으면 로컬에서 직접 재현 가능

---

## 2026-07-11 — 커뮤니티 목록 "내가 쓴 글" 필터 연동

### 작업 요약

- 커뮤니티 목록 상단에 "내가 쓴 글" 체크박스 추가. 체크 여부에 따라 호출 API를 `GET /api/v1/posts` ↔ `GET /api/v1/users/me/posts`로 전환 (같은 화면, 페이지 분리 없음)
- 카테고리 필터는 두 API 모두 지원 → 그대로 유지
- 나라(countryId) 필터는 "내가 쓴 글" API가 미지원 → 체크 시 나라 탭을 비활성화하고 선택값 초기화
- "내가 쓴 글" 체크 시 `getMe()`로 로그인 확인 후 비로그인이면 기존 로그인 필요 모달 재사용

### 수정 파일

- `src/features/services/community.service.ts` — `getMyCommunityPosts()` 추가, 응답 파싱 로직 `parseCommunityPostPage`로 공통화
- `src/features/community/types/post.ts` — `GetMyCommunityPostsParams` 타입 추가 (countryId 없음)
- `src/features/community/components/main/CommunityPageClient.tsx` — `isMyPostsOnly` 상태, API 분기, 로그인 가드, 나라 필터 초기화
- `src/features/community/components/common/CommunityHeader.tsx` — "내가 쓴 글" 체크박스 UI, 나라 탭 비활성화 처리
- `src/features/community/components/main/CommunityCategory.tsx` — 탭 버튼 `disabled` prop 지원

### 실행한 검증

- `npm run lint`: 통과 (이번 변경 관련 신규 에러 없음, 기존 파일들에 있던 `react-hooks/set-state-in-effect` 패턴과 동일한 경고가 CommunityPageClient.tsx에도 존재하나 기존 코드 스타일 그대로 유지)
- `npm run build`: 미실행 (`tsc --noEmit`으로 타입체크만 확인, 통과 — classroom 테스트 관련 기존 에러 2건은 무관)
- test: 미실행
- 브라우저 시각 확인: **못함** — Chrome 확장 연결 실패로 실제 클릭 테스트는 못 했음

### 문제

- Chrome 브라우저 도구 연결 불가로 실제 화면 동작(체크박스 토글, API 전환, 나라 탭 비활성화) 시각 검증을 못 했음
- `GET /api/v1/users/me/posts` 백엔드 실제 구현 여부 미확인 (가이드 문서 기준으로만 연동)

### 해결 방법

- 타입체크/린트로 정적 검증만 완료, 실제 동작 확인은 다음 세션 또는 사용자 로컬 확인 필요

### 다음 참고사항

- `npm run dev` (포트 17000)로 로컬에서 체크박스 토글 시 네트워크 탭에서 `/api/v1/users/me/posts` 호출 및 응답 확인 필요
- 백엔드가 401 등 인증 실패를 어떻게 내려주는지 확인 후 에러 메시지 처리 보강 여지 있음

---

## 2026-07-11 — 커뮤니티 types.ts → types/ 폴더 분리

### 작업 요약

- `src/features/community/types.ts` 단일 파일(336줄)을 도메인별로 분리: `category.ts`, `post.ts`, `comment.ts`, `reaction.ts`, `report.ts`, `common.ts` + `index.ts`(barrel export)
- 죽은 타입 제거: `CommunityReportTargetType`, `CommunityReportReasonOption` (외부에서 이름으로 import된 적 없음) → 사용처에 인라인 처리
- 중복 제거: `CommunityCardProps`를 `Pick<CommunityPost, ...>`로, `CommunityHeaderProps`를 `CommunityCategoryTabsProps` 확장으로 변경

### 수정 파일

- `src/features/community/types.ts` — 삭제
- `src/features/community/types/{category,post,comment,reaction,report,common,index}.ts` — 신규
- (참고: 이후 사용자가 `taxonomy.ts` → `category.ts`로 파일명 변경함)

### 실행한 검증

- `npx tsc --noEmit`: 통과 (기존 classroom 테스트 관련 에러 2건 제외)
- 기존 import 경로(`@/features/community/types`, 상대경로 `"../../types"`)는 디렉토리 import가 `index.ts`로 자동 resolve되어 수정 없이 그대로 동작 확인

### 문제

-

### 해결 방법

-

### 다음 참고사항

- 새 타입 추가 시 어느 파일로 갈지 애매하면 `index.ts`의 barrel 구조 참고 (엔티티 기준 분리: post / comment / reaction / report / category(taxonomy) / common)

---

<!-- 위 블록을 복사해서 새 날짜 항목을 추가하세요. -->
