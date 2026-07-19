# STATE

이 파일은 **팀 전체 상태판이 아닙니다.**
**현재 AI-assisted 프론트 작업의 상태만** 기록합니다. (진행 중인 한 가지 흐름 기준)

> 여러 작업이 동시에 진행되면, 마지막으로 손댄 작업 기준으로 갱신하세요.
> 자세한 인수인계는 [`HANDOFF.md`](HANDOFF.md), 완료 기록은 [`WORKLOG.md`](WORKLOG.md).

---

## 현재 작업

- 마이페이지 "내 정보 수정" 진입 게이트를 비밀번호 인증 → 이메일 인증으로 전환 (완료)
- 그 전 흐름으로 패키지 라운지(목록/상세/예약/결제) 전체 API 연동 + 결제 통합(`payments/bundle`) 전환 + 마이페이지 예약내역 연동까지 이어서 진행함 (모두 완료, 커밋 안 됨)

## 현재 브랜치

- `fix/myinfo-email#573` (커밋 없음 — working tree에 변경사항 그대로 있음, `git status --porcelain`으로 확인)

## 진행 상황

- [x] 패키지 라운지 목록/상세/예약/결제 전체 API 연동 (`GET /countries/{id}/packages`, `GET /packages/{id}`, `GET /accommodations/{id}`, `POST /bookings`, `GET /bookings/{id}`)
- [x] 결제 페이지 쿠폰/마일리지 실 API 연동 (`GET /my/coupons`, `GET /my/mileages`)
- [x] 패키지+강의 합산 결제 → `POST /payments/bundle`(통합 결제 API)로 전환 완료. 이전에 있던 "결제창 2번 + 수동 분배" 우회 로직은 전부 제거됨
- [x] 마이페이지 예약내역 "이용 전"/"이용 후" 탭을 `GET /bookings/me`로 연동 (환불 탭은 범위 제외, 더미 유지)
- [x] 진단평가→패키지 라운지 진입 시 `courseId` 유실 버그 수정 (`TabNavigation.tsx`의 `continentid`→`continentCode` 오타)
- [x] 마이페이지 "내 정보 수정" 진입 게이트를 이메일 인증으로 전환 — 깨져 있던 `mypage/page.tsx` 참조 수정, 고아 `PasswordVerifyModal.tsx` 삭제
- [ ] 위 변경사항 전부 **아직 커밋 안 됨** — 브라우저 실제 로그인 후 시각 확인도 아직 안 됨 (로그인 자격 증명이 없어 이 세션에서는 직접 못 함)
- [ ] 분할 결제(1차 DEPOSIT+강의 전액 / 2차 BALANCE만) 선택 UI — 미구현
- [ ] 환불 내역 탭(`GET /refund-requests/me`) 및 환불 요청 생성(`POST /refund-requests`) — 미구현

## 다음 할 일

- 로그인 후 브라우저에서 실제로 확인: (1) 패키지 결제(강의 포함/미포함 둘 다) 정상 완료되는지, (2) 마이페이지 예약내역 목록/상세 정상 표시, (3) "내 정보 수정" 이메일 인증 발송/확인 정상 동작
- 확인되면 커밋 (사용자가 직접 진행 — AI는 git push/커밋 안 함)
- 분할 결제 UI, 환불 내역 탭 연동은 다음 작업으로 착수

## 주의사항

- 이 세션에서 로그인 자격 증명이 없어 실제 결제/마이페이지 흐름을 브라우저로 직접 확인하지 못했음 — 사용자 확인 필요
- `src/lib/api.ts`는 공통 파일이라 건드리지 않음 (사용자 지시)
- 예약(booking)과 강의(course)는 백엔드에서 서로 참조하지 않는 완전 별도 도메인 — courseId는 프론트가 쿼리 파라미터로 직접 이어줘야 함
- 깃허브(커밋 push / PR / issue) 절대 건드리지 말 것 — 사용자 지시

---

_최종 갱신: 2026-07-19 / 작성자(도구): Claude Code_
