# STATE

이 파일은 **팀 전체 상태판이 아닙니다.**
**현재 AI-assisted 프론트 작업의 상태만** 기록합니다. (진행 중인 한 가지 흐름 기준)

> 여러 작업이 동시에 진행되면, 마지막으로 손댄 작업 기준으로 갱신하세요.
> 자세한 인수인계는 [`HANDOFF.md`](HANDOFF.md), 완료 기록은 [`WORKLOG.md`](WORKLOG.md).

---

## 현재 작업

- 나라별 인기도(country-popular) API 연동 제거, UI만 남기고 정적 셸로 전환 완료

## 현재 브랜치

- `fix/user-community#476`

## 진행 상황

- [x] `types.ts` → `types/` 폴더 도메인별 분리 (category/post/comment/reaction/report/common) + 죽은 타입 제거 + 중복 타입 정리
- [x] `getMyCommunityPosts` 서비스 함수 추가, `CommunityPageClient`/`CommunityHeader`/`CommunityCategory`에 "내가 쓴 글" 체크박스 및 나라 필터 비활성화 로직 연동
- [x] `CompleteModal`을 `Modal` 사이즈 기준(360px, 22px/16px)으로 통일
- [x] 강의 수정 시 마일리지 미표시 — `getMaxRewardMileage()` 방어적 폴백 추가 (원인 100% 확정은 아님)
- [x] 통계매니저 정리 — 사이드바 미연결 구 기능(coupons/lecture-analysis/interest) + dangling 서비스(`adminReservationConversion.service.ts`) + 고아 리다이렉트(`moneyadmin/coupons`) 삭제, 헤더/사이드바/user/country-popular/신규 placeholder는 유지
- [x] country-popular API 연동 제거 — `useCountryPopularity` 훅, `adminCountryStatistics.service.ts` 삭제, UI는 빈 데이터로 렌더링되는 정적 셸로 유지
- [ ] 로컬 브라우저에서 실제 토글/입력값/화면 동작 시각 확인 (Chrome 확장 연결 실패 + 관리자 로그인 권한 없음으로 계속 미완료)

## 다음 할 일

- `npm run dev`(포트 17000)로 "내가 쓴 글" 체크박스 토글 → 네트워크 탭에서 API 전환 확인
- 백엔드에 `GET /api/v1/users/me/posts`가 가이드대로 실제 구현되어 있는지 확인
- 강의 수정 페이지에서 마일리지가 이제 정상 표시되는지 확인, 안 되면 GET 응답 원문(Network 탭) 공유 필요

## 주의사항

- 깃허브(커밋 push / PR / issue) 절대 건드리지 말 것 — 사용자 지시
- "내가 쓴 글" API는 나라(countryId) 필터 미지원 → 체크 시 나라 탭은 비활성화만 하고 숨기지는 않음
- 브라우저 시각 검증은 Chrome 확장 연결 문제 + 관리자 계정 부재로 계속 못 하고 있음 (콘텐츠매니저 화면은 로그인 권한 필요)

---

_최종 갱신: 2026-07-11 / 작성자(도구): Claude Code_
