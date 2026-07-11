# API

이 문서는 **전체 백엔드 API 목록을 복사하는 곳이 아닙니다.**
**프론트가 실제로 사용하는 엔드포인트**와 **최근 변경된 엔드포인트**만 정리합니다.

- 전체 API 레퍼런스 → **Swagger** 참고
- 백엔드 API 변경 내역 → **백엔드 repo의 `.ai/API.md`** 또는 **PR의 `Frontend Impact` 섹션** 참고

프론트 API 클라이언트: `src/lib/api.ts` (fetch 기반 커스텀 클라이언트, `ApiResponse<T>` / `unwrapData` / `ApiRequestError`)

## Backend Source

- Backend Swagger: <URL>  <!-- TODO: 팀 확인 필요 -->
- Backend repo: <URL>  <!-- TODO: 팀 확인 필요 -->
- Backend API 변경 노트: 백엔드 `.ai/API.md` 또는 PR `Frontend Impact`

---

## Used Endpoints

<!-- 아래 블록을 복사해서 엔드포인트마다 추가하세요. 프론트가 실제로 호출하는 것만. -->

### GET /api/v1/posts

#### Used In

- `src/features/services/community.service.ts` (`getCommunityPosts`) — 커뮤니티 목록 전체 글 조회, `CommunityPageClient.tsx`

#### Request Fields

- `lastPostId`: number (optional) — 무한스크롤 커서, 첫 진입 시 생략
- `categories`: string (optional) — 카테고리 코드 콤마 연결 (예: `QUESTION,COMPANION`), 전체 선택 시 생략
- `countryId`: number (optional) — 나라 필터. **이 엔드포인트만 지원**

#### Response Fields Used

- `data.posts[]`: `CommunityPost` — `normalizePost`로 정규화
- `data.lastPostId`: number
- `data.hasNext`: boolean

#### Error Handling

- 실패 시 `CommunityPageClient`에서 에러 메시지 표시, 폴백 없음

#### Notes

- 무한스크롤 기준 API. 나라 필터는 이 엔드포인트에서만 동작.

---

### GET /api/v1/users/me/posts

#### Used In

- `src/features/services/community.service.ts` (`getMyCommunityPosts`) — 커뮤니티 목록에서 "내가 쓴 글" 체크 시, `CommunityPageClient.tsx`

#### Request Fields

- `lastPostId`: number (optional) — 무한스크롤 커서
- `categories`: string (optional) — 카테고리 코드 콤마 연결
- ~~`countryId`~~ — **미지원.** 프론트에서 "내가 쓴 글" 체크 시 나라 필터 UI를 비활성화하고 파라미터 자체를 보내지 않음

#### Response Fields Used

- `data.posts[]` / `data.lastPostId` / `data.hasNext` — `GET /api/v1/posts`와 응답 형태 동일 (`PostListResponse`), `parseCommunityPostPage`로 파싱 공유

#### Error Handling

- 로그인 쿠키(JWT)로 서버가 userId 자동 추출. 비로그인 상태 진입은 프론트에서 `getMe()`로 사전 차단(로그인 필요 모달) — 이 엔드포인트 자체의 401 응답 처리는 아직 미확인/미검증

#### Notes

- 나라(countryId) 필터와 조합 불가 — 백엔드 미지원 (2026-07-11 가이드 기준)
- 실제 백엔드 구현 여부는 로컬/스테이징에서 아직 시각 확인 못함 (아래 최근 변경 항목 참고)

---

## 최근 변경된 API

<!-- 백엔드 변경으로 프론트가 대응했거나 대응해야 하는 항목. 날짜 + 요약 + 영향 파일. -->

- 2026-07-11 — `GET /api/v1/users/me/posts` 신규 연동 (커뮤니티 "내가 쓴 글" 필터, 사용자 제공 가이드 기준). 나라 필터 미지원. 백엔드 실제 동작은 아직 시각 검증 안 됨 / 영향: `src/features/services/community.service.ts`, `src/features/community/components/main/CommunityPageClient.tsx`, `src/features/community/components/common/CommunityHeader.tsx`
