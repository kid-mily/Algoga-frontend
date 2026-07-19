# WORKLOG

**완료된 작업을 날짜별로 기록**합니다. 최신 항목을 위로 추가하세요. (진행 중 상태는 [`STATE.md`](STATE.md))

---

## 2026-07-19 (2) — 내 정보 수정 이미지 반영 지연 버그, 비활성 필드 구분 안 되는 문제 수정

### 작업 요약

- "내 정보 수정" 저장 후 프로필 이미지가 새로고침 전까지 반영 안 되던 버그 수정. 원인: `MyPageEditForm.tsx`가 저장 후 `profile-updated` 커스텀 이벤트를 쏘지만, 실제 상태를 들고 있는 `useMyPage` 훅은 마운트 시 한 번만 fetch할 뿐 이 이벤트를 듣지 않았음. `/mypage/edit` → `/mypage` 이동은 레이아웃에 물린 `MyPageDataProvider`가 리마운트 없이 유지되는 클라이언트 내비게이션이라 `router.refresh()`도 효과가 없었음 → `useMyPage`에 `profile-updated` 리스너를 추가해 이벤트 detail로 로컬 상태를 즉시 갱신하도록 수정
- "내 정보 수정" 페이지에서 수정 불가 필드(성명/사용자 코드/아이디/성별/생년월일)가 입력 가능 필드와 시각적으로 잘 구분되지 않던 문제 개선. 자물쇠 아이콘 추가, `disabled:cursor-not-allowed` 및 배경/텍스트 대비 강화

### 수정 파일

- `src/features/mypage/hooks/userMyPage.ts` — `profile-updated` 이벤트 리스너 추가
- `src/features/mypage/edit/MyPageEditForm.tsx` — 비활성 필드 자물쇠 아이콘 + 스타일 강화

### 실행한 검증

- `tsc --noEmit`: 통과
- `npm run lint` (변경 파일 한정): 기존에도 있던 `userMyPage.ts`의 `react-hooks/set-state-in-effect` 에러 1건(내가 건드리지 않은 기존 `fetchMyPage` 호출부) 외 신규 에러 없음
- 브라우저: 비로그인 상태로 `/mypage/edit` 접근 시 콘솔에 로그인 필요 에러만 있고 신규 런타임 에러 없음 확인. 로그인 후 실제 이미지 반영/자물쇠 아이콘 시각 확인은 이 세션에서도 로그인 자격 증명이 없어 못함

### 다음 참고사항

- 로그인 계정으로 (1) 프로필 이미지 변경 후 저장 시 새로고침 없이 바로 반영되는지, (2) 비활성 필드 자물쇠 아이콘이 의도대로 보이는지 확인 필요

## 2026-07-19 — 결제 통합 API(bundle) 전환, 마이페이지 이메일 인증 전환 마무리

### 작업 요약

- `POST /api/v1/payments/bundle`(패키지+강의 통합 결제) 신규 연동. 07-17에 만들었던 "토스페이 2번 + `POST /payments`+`POST /payments/lecture` 순차 호출" 우회 구조와 그 안의 쿠폰/마일리지 수동 분배 로직을 전부 제거하고 이 API로 교체 — 결제창 1번만 뜨고, 쿠폰/마일리지는 백엔드가 패키지분에만 자동 적용
- `courseIds`가 `minItems:1`이라 강의가 없는 예약은 이 API를 못 써서, 강의 있으면 `createBundlePayment`, 없으면 기존 `createPayment`로 분기
- 마이페이지 "내 정보 수정" 진입 게이트를 비밀번호 인증 → 이메일 인증으로 바꾸는 작업 마무리. 서비스/타입/새 모달(`EmailAuthVerifyModal.tsx`)은 이미 만들어져 있었고, `mypage/page.tsx`가 삭제된 옛날 state(`isPasswordModalOpen`)를 여전히 참조해 빌드가 깨져 있던 것만 `isEmailAuthModalOpen`/`EmailAuthVerifyModal`로 교체. 더는 안 쓰이던 `PasswordVerifyModal.tsx` 삭제

### 수정/삭제 파일

- `src/features/packagelounge/types.ts` — `CreateBundlePaymentRequest`/`BundlePaymentResponse` 추가
- `src/features/services/package.service.ts` — `createBundlePayment` 추가
- `src/features/packagelounge/hooks/usePackagePayment.ts` — `handlePay` 대폭 단순화 (분배 계산 로직 제거)
- `src/app/(user)/mypage/page.tsx` — 이메일 인증 모달로 교체
- 삭제: `src/features/mypage/PasswordVerifyModal.tsx`

### 실행한 검증

- `tsc --noEmit`: 통과
- `npm run lint` (해당 파일 한정): 통과, 신규 에러/경고 없음
- 브라우저: 마이페이지 이메일 인증은 로그인 상태에서 콘솔 에러 없음 확인. 결제 실제 흐름은 로그인 필요해 사용자 확인 대기 중

### 다음 참고사항

- 분할 결제(1차 DEPOSIT+강의 전액 / 2차 BALANCE만) 선택 UI는 아직 없음
- 환불 내역 탭(`GET /refund-requests/me`) 연동은 여전히 다음 작업 대상
- 상세 내용은 [`API.md`](API.md)의 "최근 변경된 API" 참고

---

## 2026-07-18 — 마이페이지 예약내역 연동, 진단평가 라우팅 버그 수정

### 작업 요약

- 마이페이지 예약 내역 "이용 전"/"이용 후" 탭을 실제 API(`GET /bookings/me`)로 연동. 환불 내역 탭/버튼은 범위 제외하고 기존 더미(sessionStorage 기반) 그대로 유지
- 진단평가 → 패키지 라운지 진입 흐름에서 `courseId`가 계속 유실되는 버그의 근본 원인 발견: API 문제가 아니라 `TabNavigation.tsx`가 Next.js 동적 라우트 파라미터를 실제 폴더명(`[continentCode]`)이 아닌 존재하지 않는 키(`continentid`)로 꺼내서 URL에 `undefined`가 그대로 들어가던 것 — `continentCode`로 수정

### 수정/삭제 파일

- `src/features/services/package.service.ts` — `getMyBookings` 추가, `toBookingDetail` 헬퍼로 리팩터
- `src/features/mypage/reservations/reservation.util.ts` — 신규 (예약 API → 화면용 타입 매핑)
- `src/features/mypage/reservations/ReservationPage.tsx`, `ReservationDetail.tsx` — 실 데이터 연동
- `src/features/classroom/components/TabNavigation.tsx` — `continentid` → `continentCode`

### 실행한 검증

- `tsc --noEmit` / `npm run lint`: 통과
- 브라우저: 로그인 필요해 실제 목록 렌더링은 사용자 확인 필요

### 다음 참고사항

- 환불 요청 생성(`POST /refund-requests`, `paymentId` 확보 방법 포함)은 다음 작업 대상

---

## 2026-07-17 — 패키지 결제 쿠폰/마일리지 실연동, 환불 정책 모달 연결

### 작업 요약

- 결제 페이지 더미 쿠폰/마일리지를 `GET /my/coupons`, `GET /my/mileages` 실 API로 교체
- 패키지+강의 합산 결제 시도 (이후 07-19에 bundle API로 대체됨 — 과정에서 PortOne 실 승인액과 분할 요청 금액 불일치로 `PAY_003` 발생 → 결제창 2번으로 임시 수정)
- 결제 페이지 "환불 정책 확인하기" 버튼에 onClick이 없던 것을 발견, 기존 `CancellationPolicyModal.tsx` 연결

### 다음 참고사항

- 상세 내용은 [`API.md`](API.md)의 07-17 항목들 참고 (이 날짜에 항목이 여러 개라 API.md가 더 정확함)

---

## 2026-07-14 — 컨텐츠매니저 컴포넌트/테스트, 통계매니저 3개 페이지 개발

### 오늘 한 일

- 컨텐츠매니저 강의 관리(강의/챕터/퀴즈) 컴포넌트 작성 및 단위 테스트 코드 작성 완료
- 컨텐츠매니저 쿠폰 관리 컴포넌트 작성 및 단위 테스트 코드 작성 완료
- 컨텐츠매니저 마일리지 관리 컴포넌트 작성 및 단위 테스트 코드 작성 완료
- 컨텐츠매니저 퀴즈 중복 정답 등록 오류, 퀴즈 중복 등록 오류 수정 완료
- 통계매니저 나라·강의 관심도 분석 페이지 개발 및 백엔드 API 연동 완료
- 통계매니저 잔금 관리 페이지 개발 및 백엔드 API 연동 완료
- 통계매니저 환불 관리 페이지 개발 및 백엔드 API 연동 완료

### 막힌 점

- 환불 관리 "나라별 환불율" 실데이터는 백엔드 배포 대기 중 (배포 전까지 목데이터 유지)

---

## 2026-07-11 — 나라별 인기도(country-popular) API 연동 제거, UI만 유지

### 작업 요약

- "나라별 인기도" 화면의 실제 데이터/차트/표 UI는 그대로 두고, 백엔드 연동(fetch, CSV 다운로드) 관련 코드만 전부 제거
- `useCountryPopularity` 훅과 `adminCountryStatistics.service.ts`(GET `/api/v1/admin/stats/countries/top10`, CSV 다운로드) 삭제
- `CountryPopularityManageClient`는 훅 대신 로컬 `useState`로 기간/검색어만 관리하고, 국가 목록은 빈 배열(`EMPTY_COUNTRIES`) 고정 → 요약카드/차트/표는 항상 "데이터 없음" 상태로 렌더링되는 정적 UI 셸이 됨
- Toolbar에서 CSV 다운로드 버튼(API 전용 기능) 제거, 기간/검색 입력 UI는 유지
- Table/TopChart의 `isLoading` prop 제거 (더 이상 비동기 로딩이 없으므로)
- `types.ts`에서 API 응답 전용 타입 `CountryPopularityData` 제거, `utils.ts`에서 API 에러 포맷터 `formatCountryPopularityError` 제거 (포맷팅/집계 순수 함수들은 유지)

### 수정/삭제 파일

- 삭제: `src/features/services/adminCountryStatistics.service.ts`, `src/features/statisticadmin/country-popular/hooks/useCountryPopularity.ts`
- 수정: `CountryPopularityManageClient.tsx`, `CountryPopularityToolbar.tsx`, `CountryPopularityTable.tsx`, `CountryPopularityTopChart.tsx`, `country-popular/types.ts`, `country-popular/utils.ts`
- 유지(변경 없음): `CountryPopularitySummaryCards.tsx`

### 실행한 검증

- `tsc --noEmit`: 통과 (무관한 기존 에러 제외)
- `npm run lint` (해당 폴더 한정): 통과, 경고 없음
- grep으로 삭제한 훅/서비스/타입 참조 전무 확인
- 브라우저 시각 확인: 못함 (관리자 로그인 권한 없음)

### 다음 참고사항

- 나중에 실제 통계 API가 다시 붙으면 `CountryPopularityManageClient`의 `EMPTY_COUNTRIES` 고정값과 로컬 상태를 다시 fetch 훅으로 교체하면 됨 (UI 컴포넌트들은 props 인터페이스 그대로 유지되어 있어 재연동 시 큰 변경 불필요)

---

## 2026-07-11 — 통계매니저(statisticadmin) 미사용 콘텐츠 정리

### 작업 요약

- 사용자 요청: 헤더/사이드바/유저유입경로통계 + 사이드바에 현재 연결된 신규 placeholder 페이지만 남기고 나머지 통계매니저 콘텐츠 전부 삭제
- `StatisticAdminSidebar.tsx` 메뉴(8개: 매출현황/유입경로별전환/나라·강의관심도/잔금·미수금/환불·취소/강의·쿠폰→여행전환/재구매·LTV/나라별수익성)에 실제로 연결된 라우트만 남기고, 사이드바에서 연결이 끊긴 구(舊) 라우트/기능 삭제
- 정리 중 이미 삭제된 `reservation-conversion` 기능의 dangling 서비스 파일(`adminReservationConversion.service.ts`, 아무도 import 안 함)도 함께 정리
- `statisticadmin/coupons`를 리다이렉트하던 `moneyadmin/coupons/page.tsx`도 다른 곳에서 링크되지 않는 고아 라우트라 함께 삭제 (범위 밖이지만 안 지우면 깨진 리다이렉트로 남음)

### 삭제한 파일/폴더

- `src/app/statisticadmin/coupons/` — 사이드바 미연결 (구 쿠폰 통계 페이지)
- `src/app/statisticadmin/lecture-analysis/` — 사이드바 미연결 (구 수강률 분석 페이지)
- `src/app/statisticadmin/interest/` — 사이드바 미연결 (고아 placeholder, "나라/강의 관심도" 메뉴는 `country-popular`로 연결됨)
- `src/features/statisticadmin/coupon/` (components/hooks/types/utils 전체)
- `src/features/statisticadmin/lecture-analysis/` (components/hooks/types/utils 전체)
- `src/features/services/adminCouponStatistics.service.ts` — coupon 기능 전용, 사용처 없어짐
- `src/features/services/adminCourseEnrollmentStatistics.service.ts` — lecture-analysis 기능 전용, 사용처 없어짐
- `src/features/services/adminReservationConversion.service.ts` — 이미 삭제된 기능의 dangling 서비스 (아무도 참조 안 함)
- `src/app/moneyadmin/coupons/page.tsx` — `/statisticadmin/coupons`로의 고아 리다이렉트, 어디서도 링크 안 됨

### 유지한 파일/폴더

- `src/features/admin/common/StatisticAdminSidebar.tsx`, `ContentHeader`(공용 헤더) — 그대로
- `src/features/statisticadmin/user/*` — 유저유입경로통계 (요청대로 유지)
- `src/features/statisticadmin/country-popular/*` — 사이드바 "나라/강의 관심도"에 실제 연결된 기능이라 유지
- `src/features/statisticadmin/common/components/StatisticPlaceholderPage.tsx` — sales/balance-receivable/refund-cancel/course-coupon-travel/repurchase-ltv/country-profitability 등 신규 placeholder 페이지들이 공용으로 사용 중
- `src/features/services/adminCountryStatistics.service.ts`, `adminUserStatistics.service.ts` — 각각 country-popular/user가 사용 중
- `src/features/services/adminCoupon.service.ts` — 통계 아닌 contentmanage 쿠폰 기능이 사용 중, 무관하므로 유지

### 실행한 검증

- `grep`으로 삭제 대상 심볼/경로가 다른 곳에서 참조되는지 전수 확인 후 삭제
- `tsc --noEmit`: 통과 (스테일 `.next` 캐시가 삭제된 라우트를 참조해 에러 냈던 것 확인 → `.next` 삭제 후 재통과)
- `npm run lint` (statisticadmin 영역 한정): 통과 (기존 무관 경고만 존재)
- 브라우저 시각 확인: 못함 (관리자 로그인 권한 없음)

### 문제

-

### 해결 방법

-

### 다음 참고사항

- placeholder 상태로 남아있는 페이지(sales/balance-receivable/refund-cancel/course-coupon-travel/repurchase-ltv/country-profitability)는 실제 통계 기능 구현 필요 시 `StatisticPlaceholderPage` 자리에 실제 컴포넌트로 교체하면 됨

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
