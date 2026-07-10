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

### METHOD /api/v1/...

#### Used In

- `src/features/.../...tsx` — <어떤 화면/동작에서 쓰는지>

#### Request Fields

- `field`: type — <설명>

#### Response Fields Used

- `data.field`: type — <프론트에서 실제 사용하는 필드만>

#### Error Handling

- <status/code별 처리, 사용자 노출 메시지, 폴백>

#### Notes

- <페이지네이션, 인증 필요 여부, 최근 변경, 주의점 등>

---

## 최근 변경된 API

<!-- 백엔드 변경으로 프론트가 대응했거나 대응해야 하는 항목. 날짜 + 요약 + 영향 파일. -->

- YYYY-MM-DD — <엔드포인트> <변경 요약> / 영향: `path`
