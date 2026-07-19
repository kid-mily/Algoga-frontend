# HANDOFF

새 채팅 / 다른 AI 도구 / 다른 작업자에게 작업을 넘길 때 쓰는 **인수인계 양식**입니다.
넘기기 직전에 아래를 채워 주세요. 받는 쪽은 이 파일과 [`STATE.md`](STATE.md)를 먼저 읽습니다.

---

## 현재 목표

- 마이페이지 "내 정보 수정" 진입 게이트를 비밀번호 인증 → 이메일 인증으로 전환 완료 (직전 작업)
- 그 전 단계로 패키지 라운지 결제 통합(`payments/bundle`)·마이페이지 예약내역 연동까지 이어서 완료됨

## 완료한 작업

- 패키지 라운지 목록/상세/예약/결제 전체 API 연동
- 결제 페이지 쿠폰/마일리지 실 API 연동, 환불 정책 모달 연결
- 패키지+강의 합산 결제를 `POST /payments/bundle`(신규 통합 결제 API)로 전환 — 이전 "결제창 2번 + 수동 분배" 우회 로직 완전 제거
- 마이페이지 예약내역 "이용 전"/"이용 후" 탭 `GET /bookings/me` 연동
- 진단평가→패키지 라운지 `courseId` 유실 버그 수정 (`TabNavigation.tsx` `continentid`→`continentCode`)
- 마이페이지 "내 정보 수정" 이메일 인증 전환 마무리

## 수정한 파일

- `src/features/packagelounge/types.ts` — `CreateBundlePaymentRequest`/`BundlePaymentResponse` 등 추가
- `src/features/services/package.service.ts` — `createBundlePayment`, `getMyBookings`, `toBookingDetail` 헬퍼
- `src/features/packagelounge/hooks/usePackagePayment.ts` — `handlePay` 대폭 단순화
- `src/features/packagelounge/components/{BookingPrice,PackagePaymentClient,PaymentSummary}.tsx`
- `src/features/mypage/reservations/reservation.util.ts` (신규), `ReservationPage.tsx`, `ReservationDetail.tsx`
- `src/features/classroom/components/TabNavigation.tsx`
- `src/app/(user)/mypage/page.tsx`
- 삭제: `src/features/mypage/PasswordVerifyModal.tsx`
- 전부 **커밋 안 됨** (`fix/myinfo-email#573` 브랜치, working tree에 그대로 있음)

## 남은 작업

- [ ] 로그인 후 브라우저 실제 확인: 패키지 결제(강의 포함/미포함), 마이페이지 예약내역, 내 정보 수정 이메일 인증 — 이 세션에서 로그인 자격 증명이 없어 시각 검증 못함
- [ ] 확인되면 커밋 (AI는 git push/커밋 안 함, 사용자가 직접)
- [ ] 분할 결제(1차 DEPOSIT+강의 전액 / 2차 BALANCE만) 선택 UI — 미구현
- [ ] 환불 내역 탭(`GET /refund-requests/me`), 환불 요청 생성(`POST /refund-requests`) — 미구현, `paymentId` 확보 방법도 아직 미정

## 실행한 검증

- [x] `tsc --noEmit` (전체 통과, 무관한 기존 이슈 없음)
- [x] `npm run lint` (변경 파일 한정, 신규 에러/경고 없음 — 기존에 있던 무관한 경고 몇 개만 남음)
- [ ] 로컬 브라우저 로그인 후 실제 동작 확인 — **미완료** (로그인 계정 정보 없음)
- [ ] `npm run build`
- [ ] test

## 주의사항 / 함정

- **깃허브 절대 건드리지 말 것** (커밋 push, PR, issue 생성 전부 금지 — 사용자 지시)
- `src/lib/api.ts`는 공통 파일이라 수정 안 함
- 예약(booking)과 강의(course)는 백엔드에서 서로 참조 안 하는 완전 별도 도메인 — `courseId`는 프론트가 화면 이동마다 쿼리 파라미터로 직접 이어줘야 함 (`buildQueryString` 헬퍼 사용)
- `POST /payments/bundle`의 `courseIds`는 `minItems:1`이라 빈 배열 불가 — 강의 없는 예약은 기존 `POST /payments`로 분기 유지 중
- 결제 관련 모든 API 검증은 "PortOne 실제 승인액 = 요청 amount" 규칙을 따름 — 토스페이 결제창 호출과 백엔드 결제 생성 API 호출은 반드시 1:1로 짝지어야 함

## 먼저 볼 파일

- `AGENTS.md`
- `.ai/API.md` (엔드포인트별 상세 + 최근 변경 이력)
- `src/features/packagelounge/hooks/usePackagePayment.ts`
- `src/app/(user)/mypage/page.tsx`
- `src/features/mypage/reservations/reservation.util.ts`

---

_작성: 2026-07-19 / 작성자(도구): Claude Code_
