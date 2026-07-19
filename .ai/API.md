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

### GET /api/v1/admin/courses/{courseId}

#### Used In

- `src/features/services/adminCourse.service.ts` (`getAdminCourse`) — 콘텐츠매니저 강의 수정 페이지 초기값 로드, `EditLectureClient.tsx`

#### Response Fields Used

- `data.maxRewardMileage`: number — "최대 지급 마일리지" 입력값. **주의**: 이 저장소에서 마일리지 필드는 과거 여러 차례(#59/#125/#172/#221/#281/#348) `mileage` ↔ `maxRewardMileage` 필드명 불일치로 반복 이슈 발생. 프론트는 `getMaxRewardMileage()`(`lectureFormatters.ts`)로 `maxRewardMileage → max_reward_mileage → mileage → reward_mileage` 순 방어적 폴백 처리 중이나, 실제 정확한 응답 필드명은 Swagger/네트워크탭으로 재확인 필요 (2026-07-11 기준 미확인)

#### Notes

- 2026-07-11: 강의 수정 시 마일리지 미표시 이슈 보고 → 방어적 폴백만 추가, 근본 원인(백엔드 실제 필드명) 미확정

---

### GET /api/v1/countries/{countryId}/packages

#### Used In

- `src/features/services/package.service.ts` (`getPackagesByCountry`) — 패키지 라운지 목록 조회, `src/app/(user)/packagelounge/page.tsx` (서버 컴포넌트, `searchParams.countryId` 필요)

#### Response Fields Used

- `data[]`: `PackageApiItem` (`src/features/packagelounge/types.ts`) — `packageId`, `countryId`, `countryName`, `accommodationId`, `accommodationName`, `name`, `description`, `imageUrl`, `price`, `checkInDate`, `checkOutDate`, `nights`, `flightInfo`/`returnFlightInfo`(각각 null 가능), `flightPrice`, `pricePerNight`, `accommodationPrice`, `totalPrice`, `depositPrice`, `balancePrice`

#### Error Handling

- `countryId` 없으면 API 호출 자체를 생략하고 빈 배열 처리 (목록 페이지에 빈 상태 표시)
- 실패 시 콘솔 로그만 남기고 빈 배열로 폴백 (`suppressGlobalError: true`)

#### Notes

- `countryId` 없는 전체 목록용 `GET /api/v1/packages`는 아직 프론트에서 미사용
- 카드 정렬(가격/출발일순)은 프론트에서만 처리, 서버 정렬 파라미터 없음

---

### GET /api/v1/packages/{packageId}

#### Used In

- `src/features/services/package.service.ts` (`getPackageDetail`, `getPackageLoungeDetail`) — 패키지 상세 페이지(`src/app/(user)/packagelounge/[packageId]/page.tsx`), 예약 확인 화면(`ReservationClient.tsx` → `ReservationSummary.tsx`)

#### Response Fields Used

- `data`: `PackageApiItem` — 목록 API와 동일한 필드 (위 참고)

#### Error Handling

- 404(`errorCode: PKG_001`) 시 Next.js `notFound()` 호출 (`ApiRequestError.status === 404` 체크)
- 그 외 에러는 콘솔 로그 후 그대로 throw

#### Notes

- `accommodationId`로 아래 숙소 API를 이어서 호출해 상세 페이지에 필요한 주소/설명을 보충 (`getPackageLoungeDetail`)
- 숙박 일수 계산은 반드시 이 응답의 `nights`를 써야 함 — 숙소 API의 `nights`는 해당 패키지와 무관하게 0으로 내려올 수 있어 사용 금지 (`utils/payment.ts` 참고)
- 결제 금액(`totalPrice`/`depositPrice`/`balancePrice`/`accommodationPrice`)은 백엔드가 계산해서 내려주므로 프론트에서 재계산하지 않음 (PR #531, 2026-07-15 머지 확인됨)
- `flightInfo`/`returnFlightInfo`는 실시간 항공 조회 실패 시 `null`일 수 있음 — 상세 페이지 예약 버튼은 둘 중 하나라도 null이면 비활성화 처리 (`PackageBookingSummary.tsx`의 `canBook`)

---

### GET /api/v1/accommodations/{accommodationId}

#### Used In

- `src/features/services/package.service.ts` (`getAccommodationDetail`, `getPackageLoungeDetail`) — 패키지 상세 페이지의 숙소 주소/설명 표시

#### Response Fields Used

- `data`: `AccommodationResponse` (`src/features/packagelounge/types.ts`) — `address`, `description`, `imageUrl`만 사용. `name`/`pricePerNight`/`nights`는 PR #531 이후 패키지 API 응답(`accommodationName`/`accommodationPrice`/`nights`)으로 대체되어 더 이상 이 응답에서 읽지 않음

#### Notes

- 목록 페이지에서는 이 API를 호출하지 않음 (숙소명이 목록 API 응답(`accommodationName`)에 이미 포함되어 N+1 호출을 피함)

---

### POST /api/v1/bookings

#### Used In

- `src/features/services/package.service.ts` (`createBooking`) — 예약 확인 화면(`ReservationSummary.tsx`)의 "예약하기" 버튼

#### Request Fields

- `accommodationId`, `flightInfo`, `returnFlightInfo`, `flightPrice`, `checkInDate`, `checkOutDate`: 패키지 상세 응답(`PackageApiItem`) 값을 그대로 전달
- `passengerInfo`: `{ lastName, firstName, birthDate, passportNumber, passportExpiry }` — `PassengerForm.tsx`에서 입력받아 sessionStorage(`passengerStorage.ts`)에 저장된 값을 제출 시점에 읽어와 매핑
- `bookingSource`: `"LOUNGE"` 고정 (완강 후 예약인 `"COMPLETION"` 플로우는 별도 작업 대상, 아직 미구현)

#### Response Fields Used

- `data`: number — 생성된 `bookingId`. 성공 시 `/packagelounge/booking/{bookingId}`로 이동

#### Error Handling

- `flightInfo`/`returnFlightInfo` 중 하나라도 없으면(null) 버튼 자체를 비활성화해 호출을 막음
- 실패 시 화면에 에러 문구 표시, 재시도 가능 (`suppressGlobalError: true`)

#### Notes

- 400 `BK_003`(예약 가능한 패키지가 없음) 등 세부 에러 코드별 안내 문구는 아직 미분기 처리 — 공통 에러 문구만 표시 중

---

### GET /api/v1/bookings/{bookingId}

#### Used In

- `src/features/services/package.service.ts` (`getBookingDetail`) — 예약 생성 직후 확인 페이지 `src/app/(user)/packagelounge/booking/[bookingId]/page.tsx` → `BookingConfirmation.tsx`

#### Response Fields Used

- `data`: `bookingId`, `status`, `totalPrice`, `depositPrice`, `balancePrice`, `bookingNumber`, `checkInDate`, `checkOutDate`, `nights`, `installmentAllowed`
- `data.flightInfo` / `data.returnFlightInfo` / `data.passengerInfo`: **주의 — 이 응답에서는 객체가 아니라 JSON 문자열로 내려온다.** `getBookingDetail`에서 `JSON.parse` 후 매핑(파싱 실패/누락 시 `null`)

#### Error Handling

- 404(`errorCode: BK_001`) 시 Next.js `notFound()` 호출

#### Notes

- `status`는 현재 `"PENDING"`만 확인됨 — 다른 상태값은 아직 미확인, 라벨 매핑(`BookingConfirmation.tsx`의 `STATUS_LABEL`)에 없으면 원본 문자열 그대로 표시

---

### POST /api/v1/payments

#### Used In

- `src/features/services/package.service.ts` (`createPayment`) — 패키지 결제 페이지(`usePackagePayment.ts`)의 "결제하기"

#### Request Fields

- `bookingId`: `GET /bookings/{id}`로 조회한 실제 bookingId
- `paymentType`: 현재는 `"FULL"` 고정 (분할 결제/예약금만 내는 `"DEPOSIT"` 플로우는 아직 미구현)
- `amount`: 쿠폰/마일리지 적용 후 최종 결제 금액 (`finalAmount`) — `booking.totalPrice` 기준으로 계산, 프론트에서 임의로 만들지 않음
- `usedMileage`, `usedCouponId`: 화면에서 선택한 값 그대로
- `portonePaymentId`: PortOne 결제(`requestTossPayment`, TossPay 채널) 완료 후 받은 결제 ID. 결제 금액이 0원이면 PortOne 호출 자체를 생략하고 빈 문자열로 보냄

#### Response Fields Used

- `data`: number — 생성된 `paymentId` (현재는 사용처 없이 결제 완료 페이지로만 이동)

#### Error Handling

- `errorCode`별 안내 문구 매핑(`usePackagePayment.ts`의 `PAYMENT_ERROR_MESSAGE`): `PAY_002`(예약 없음) / `PAY_003`(금액 불일치) / `PAY_004`(중복 결제) / `PAY_005`(PortOne 오류)
- **주의**: `src/lib/api.ts`의 `ApiRequestError`는 성공 응답의 `code` 필드만 `.code`로 옮겨 담고, 에러 응답의 `errorCode` 필드는 옮기지 않는다. 그래서 `error.code`가 아니라 `error.body?.errorCode`로 읽어야 한다 (공통 파일이라 `lib/api.ts` 자체는 수정하지 않음)

#### Notes

- `POST /api/v1/payments/lecture`(강의 단독 결제), `GET /api/v1/payments/calculate/lecture`는 이번 범위에 포함 안 됨 (강의+패키지 동시 결제 플로우는 별도 작업)

---

### GET /api/v1/payments/{paymentId}

#### Used In

- `src/features/services/package.service.ts` (`getPaymentDetail`) — 아직 화면에서 호출하는 곳 없음 (준비만 해둠)

#### Response Fields Used

- 전체 필드(`paymentId`, `bookingId`, `courseId`, `paymentType`, `amount`, `status`, `portonePaymentId`, `paymentMethod` 등)를 그대로 타입(`PaymentDetail`)에 반영
- `bookingId`/`courseId`는 둘 다 nullable — 예약 결제면 `courseId`가 null, 강의 단독 결제면 `bookingId`가 null

---

### POST /api/v1/payments/bundle

#### Used In

- `src/features/services/package.service.ts` (`createBundlePayment`) — 패키지 결제 페이지(`usePackagePayment.ts`)에서 courseId가 있을 때(강의 선택 후 예약한 경우)만 사용. courseId가 없으면 기존 `POST /payments`를 그대로 씀

#### Request Fields

- `bookingId`, `paymentType`("FULL" 고정, 통합 결제는 DEPOSIT/FULL만 허용), `amount`(`finalAmount` — 패키지+강의 합산 후 쿠폰/마일리지 적용된 최종 금액), `usedMileage`, `usedCouponId`, `portonePaymentId`
- `courseIds`: `[courseId]` — **minItems 1이라 빈 배열을 보낼 수 없음.** 그래서 강의가 없는 경우는 아예 이 API를 호출하지 않고 기존 `POST /payments`로 분기

#### Response Fields Used

- `data`: `BundlePaymentResponse` — `bookingPaymentId`, `lecturePaymentIds`, `bookingAmount`, `lectureAmount`, `totalAmount`. 현재 화면에서는 결제 완료 페이지로 이동만 하고 이 값들은 별도로 사용하지 않음

#### Error Handling

- `PAYMENT_ERROR_MESSAGE`(`usePackagePayment.ts`)에 `PAY_007`(강의 없음), `PAY_015`(일시불만 가능한 예약), `PAY_016`(통합 결제는 DEPOSIT/FULL만 허용) 추가

#### Notes

- **이 API 도입 전엔 토스페이 결제창을 2번 띄우고 `POST /payments` + `POST /payments/lecture`를 따로 호출하는 우회 구조였음** (2026-07-17 항목 참고). PortOne 실제 승인액과 각 API에 보내는 amount가 안 맞아 `PAY_003`이 나던 문제가 있었는데, 이 통합 API로 바뀌면서 결제창 1번 + 백엔드가 내부적으로 쿠폰/마일리지를 패키지분에만 적용해 나눠주는 구조로 완전히 대체됨 → **프론트의 수동 분배 계산 로직은 전부 제거함**
- 완강 후 예약(`installmentAllowed: false`)은 `FULL`만 가능, 이미 결제한 강의(`isPaid: true`)를 `courseIds`에 넣으면 `PAY_004`(중복 결제)

---

### GET /api/v1/bookings/me

#### Used In

- `src/features/services/package.service.ts` (`getMyBookings`) — 마이페이지 예약 내역(`src/features/mypage/reservations/reservation.util.ts`의 `loadMyReservations`), "이용 전"/"이용 후" 탭

#### Response Fields Used

- `BookingDetail[]` — `GET /bookings/{id}`와 동일한 응답 형태(`toBookingDetail` 공유, `flightInfo`/`returnFlightInfo`/`passengerInfo` JSON 문자열 파싱 동일)

#### Error Handling

- 실패 시 목록 화면에 에러 문구 표시 (`ReservationPage.tsx`의 `loadErrorMessage`)

#### Notes

- **이 API 응답엔 상품명/숙소명이 없음** (accommodationId만 있음) — 화면에 보여줄 숙소명은 `GET /accommodations/{id}`를 accommodationId별로 추가 조회해서 채움 (`loadMyReservations`)
- 백엔드 `status`(`PENDING/DEPOSIT_PAID/FULL_PAID/CANCEL_REQUESTED/REFUNDED`)엔 "이용 완료" 개념이 없어서, **체크아웃 날짜를 오늘과 비교해 이용 전/이용 후를 프론트가 직접 계산**(`reservation.util.ts`의 `resolveReservationStatus`)
- `CANCEL_REQUESTED`/`REFUNDED` 상태 예약은 이번 작업 범위에서 목록에서 제외함 — **환불 내역 탭은 아직 더미 데이터 그대로**, `GET /refund-requests/me` 연동은 다음 작업 대상
- `PassengerInfo`엔 성별/국적이 없어서 상세 화면에 표시할 값이 없음 (`"-"`로 표시)

---

## 최근 변경된 API

<!-- 백엔드 변경으로 프론트가 대응했거나 대응해야 하는 항목. 날짜 + 요약 + 영향 파일. -->

- 2026-07-11 — `GET /api/v1/users/me/posts` 신규 연동 (커뮤니티 "내가 쓴 글" 필터, 사용자 제공 가이드 기준). 나라 필터 미지원. 백엔드 실제 동작은 아직 시각 검증 안 됨 / 영향: `src/features/services/community.service.ts`, `src/features/community/components/main/CommunityPageClient.tsx`, `src/features/community/components/common/CommunityHeader.tsx`
- 2026-07-15 — PR #531 머지·배포 확인. `GET /api/v1/packages/{packageId}` 및 국가별 목록 응답(`PackageApiItem`)에 `countryName`, `accommodationName`, `pricePerNight`, `accommodationPrice`, `totalPrice`, `depositPrice`, `balancePrice` 필드 추가. 목록/상세 화면에서 프론트가 직접 하던 30% 예약금 계산(`calculatePayment`)을 제거하고 이 필드들을 그대로 사용하도록 반영 완료 / 영향: `src/features/packagelounge/types.ts`, `src/features/packagelounge/packageDetail.util.ts`, `src/features/packagelounge/components/PackageLoungeCard.tsx`, `src/features/packagelounge/components/PackageLoungeListClient.tsx`. **미반영**: 예약 확인 화면(`ReservationSummary.tsx`)의 결제 금액 표시는 아직 기존 `calculatePayment` 방식 그대로 — 다음 작업 대상
- 2026-07-15 — `POST /api/v1/bookings`(예약 생성), `GET /api/v1/bookings/{bookingId}`(예약 조회) 신규 연동. 예약 확인 화면에 탑승객 정보 입력(`PassengerForm.tsx` 재사용) + 예약 생성 버튼을 연결하고, 성공 시 새 확인 페이지(`/packagelounge/booking/{bookingId}`)로 이동해 실제 예약 데이터(`totalPrice`/`depositPrice`/`balancePrice` 등)를 보여주도록 구현 완료 / 영향: `src/features/services/package.service.ts`, `src/features/packagelounge/types.ts`, `src/features/packagelounge/components/ReservationSummary.tsx`, `src/features/packagelounge/components/BookingConfirmation.tsx`(신규), `src/app/(user)/packagelounge/booking/[bookingId]/page.tsx`(신규). **미반영**: 결제(`POST /api/v1/payments`, PortOne), `bookingSource: "COMPLETION"` 플로우는 다음 작업 대상
- 2026-07-15 — `POST /api/v1/payments`(결제 생성), `GET /api/v1/payments/{paymentId}` 신규 연동. 예약(`/booking`) 페이지의 "결제 단계로 이동" 버튼이 `POST /bookings`를 먼저 호출해 bookingId를 확보한 뒤 결제 페이지(`?bookingId=`)로 이동하도록 구조를 바꿈. 결제 페이지는 이 bookingId로 예약을 다시 조회(`GET /bookings/{id}`)해 실제 `totalPrice`를 결제 금액으로 쓰고, PortOne 결제 후 `POST /payments`로 저장. courseId 전달용으로 남겨뒀던 `countryId` 쿼리 파라미터는 예약 페이지가 패키지를 직접 재조회하면서 불필요해져 제거 / 영향: `src/features/packagelounge/types.ts`, `src/features/services/package.service.ts`, `src/features/packagelounge/components/BookingPrice.tsx`, `src/features/packagelounge/components/BookingPageClient.tsx`, `src/app/(user)/packagelounge/[packageId]/booking/page.tsx`, `src/app/(user)/packagelounge/[packageId]/payment/page.tsx`, `src/features/packagelounge/components/PackagePaymentClient.tsx`, `src/features/packagelounge/hooks/usePackagePayment.ts`. **미반영**: 분할 결제(`DEPOSIT`), 강의+패키지 동시 결제, `PaymentSummary.tsx`의 "강의" 금액 표시(기존에 `flightPrice`를 잘못 재사용하고 있던 표시 버그, 이번 작업 범위 밖이라 그대로 둠)
- 2026-07-15 — 로그인 필요 API를 서버 컴포넌트에서 직접 호출하면 브라우저 쿠키가 안 실려 401(로그인 화면)이 뜨는 문제 발견 및 수정. `GET /bookings/{id}`(로그인 유저 전용)를 서버 `page.tsx`에서 부르던 걸, 단과 결제 페이지(`SingleLecturePaymentClient.tsx`) 패턴대로 클라이언트 컴포넌트에서 직접 호출하도록 이동 — 공개 데이터(`GET /packages/{id}`, `GET /countries/{id}/packages` 등)는 그대로 서버에서 유지. `lib/api.ts`는 공통 파일이라 수정하지 않음 / 영향: `src/app/(user)/packagelounge/booking/[bookingId]/page.tsx`, `src/features/packagelounge/components/BookingConfirmation.tsx`, `src/app/(user)/packagelounge/[packageId]/payment/page.tsx`, `src/features/packagelounge/components/PackagePaymentClient.tsx`
- 2026-07-17 — 결제 페이지에 남아있던 더미 쿠폰/마일리지를 실제 API로 교체. `GET /my/coupons`, `GET /my/mileages`(둘 다 로그인 유저 전용, `myBenefit.service.ts`의 기존 `getMyCoupons`/`getMyMileages` 재사용)를 결제 페이지 진입 시 클라이언트에서 호출해 보유 쿠폰(ISSUED && usable 전체, 강의 결제와 달리 courseId로 필터링하지 않음)과 마일리지 잔액을 채움. 로딩 중엔 결제 버튼 비활성화(`isLoadingBenefits`, 단과 결제와 동일 패턴). `payment.data.ts`의 더미 쿠폰/마일리지 상수(`PAYMENT_DUMMY_COUPONS`, `PAYMENT_DUMMY_MILEAGE_BALANCE`)는 삭제 / 영향: `src/features/packagelounge/hooks/usePackagePayment.ts`, `src/features/packagelounge/components/PackagePaymentClient.tsx`, `src/features/packagelounge/payment.data.ts`. **미반영**: 분할 결제(`DEPOSIT`), 강의+패키지 동시 결제는 여전히 다음 작업 대상
- 2026-07-17 — 패키지 결제에 강의(단과) 금액을 합산 반영 (일시불/FULL만). 사용자 제공 도메인 명세 기준: 강의(courseId)와 패키지(bookingId)는 백엔드에서 서로 저장/참조되지 않는 완전 별도 도메인이라, "합산 결제 API"가 따로 있는 게 아니라 **결제 화면에서는 하나로 묶어 보여주고, 실제 결제는 `POST /payments`(패키지분) + `POST /payments/lecture`(강의분, 기존 단과 결제 API인 `SinglePayment.service.ts`의 `createLecturePayment` 재사용)를 순차 호출**하는 구조로 구현. `courseId`를 예약 페이지 → 결제 페이지까지 쿼리 파라미터로 전달하도록 확장(`buildQueryString`)하고, 결제 페이지에서 `getCourseDetail`로 강의를 재조회. 결제 금액(`productAmount`)은 `booking.totalPrice + course.price`. 쿠폰/마일리지 할인은 패키지 금액에서 먼저 차감하고 남는 할인만 강의 금액에 적용(패키지분에 우선 배분) — **이 분배 규칙은 프론트 임시 결정이라 백엔드 확인 필요**. 강의 결제(`POST /payments/lecture`) 호출이 실패하면 패키지 결제는 이미 완료된 상태이므로 성공 페이지로 넘기지 않고 "고객센터 문의" 안내만 표시 / 영향: `src/features/packagelounge/hooks/usePackagePayment.ts`, `src/features/packagelounge/components/PackagePaymentClient.tsx`, `src/features/packagelounge/components/SelectedPackage.tsx`, `src/features/packagelounge/components/PaymentSummary.tsx`, `src/features/packagelounge/components/BookingPrice.tsx`, `src/features/packagelounge/components/BookingPageClient.tsx`, `src/app/(user)/packagelounge/[packageId]/payment/page.tsx`. **미반영(당시)**: 분할 결제(1차=DEPOSIT+강의 전액/2차=BALANCE만)는 아직 결제 방식 선택 UI 자체가 없어 다음 작업 대상
- 2026-07-17 (같은 날, 후속) — 위 "순차 2회 호출" 방식이 실제로 `PAY_003`(결제 금액이 올바르지 않습니다) 에러를 유발함을 확인. 원인: 토스페이 결제창을 패키지+강의 합산 금액(`finalAmount`)으로 1번만 띄우고, `POST /payments`/`POST /payments/lecture`에는 그보다 작은 분할 금액(`packageAmount`/`lectureAmount`)을 보내서 "PortOne 실제 승인액 = 요청 amount" 검증이 깨짐. **해결책으로 토스페이 결제창을 2번(패키지분/강의분 각각) 띄우는 구조로 변경** — 각 API 호출이 자기 몫의 실제 PortOne 결제 건을 참조하도록 수정 / 영향: `src/features/packagelounge/hooks/usePackagePayment.ts`. **07-19에 `POST /payments/bundle` 도입으로 이 구조 자체가 통째로 대체됨** (아래 항목 참고) — 지금은 해당 없는 내용
- 2026-07-17 — 결제 페이지 "환불 정책 확인하기" 버튼에 onClick이 없어 아무 반응이 없던 것을 수정. 이미 구현돼 있던 `src/features/payment/CancellationPolicyModal.tsx`(단과 결제 쪽 `CancellationPolicyClient.tsx`와 같은 패턴)를 그대로 연결 / 영향: `src/features/packagelounge/components/PaymentSummary.tsx`
- 2026-07-18 — 진단평가 → 패키지 라운지 진입 흐름이 `courseId`를 잃어버리는 문제의 근본 원인 발견·수정. 원인은 API가 아니라 프론트 라우팅 버그: `TabNavigation.tsx`가 Next.js 동적 라우트 파라미터를 실제 폴더명(`[continentCode]`)이 아닌 존재하지 않는 키(`continentid`)로 꺼내서 `undefined`가 URL에 그대로 들어감(`/classroom/undefined/...`) → 이후 진단평가 결과 페이지 전체가 깨진 continentCode를 물려받음. `continentid` → `continentCode`로 수정 / 영향: `src/features/classroom/components/TabNavigation.tsx`
- 2026-07-18 — 마이페이지 예약 내역 "이용 전"/"이용 후" 탭을 실제 API(`GET /bookings/me`)로 연동 (상세 위 Used Endpoints 섹션 참고). 환불 내역 탭/버튼은 이번 범위에서 제외하고 기존 더미(`reservation.data.ts`, sessionStorage 기반) 그대로 유지 / 영향: `src/features/services/package.service.ts`(`getMyBookings` 추가, `toBookingDetail` 헬퍼로 리팩터), `src/features/mypage/reservations/reservation.util.ts`(신규), `src/features/mypage/reservations/ReservationPage.tsx`, `src/features/mypage/reservations/ReservationDetail.tsx`
- 2026-07-19 — `POST /api/v1/payments/bundle`(패키지+강의 통합 결제) 신규 연동. 상세는 위 Used Endpoints 섹션 참고. **07-17에 만들었던 "결제창 2번 + `POST /payments`+`POST /payments/lecture` 순차 호출" 구조와 그 안의 쿠폰/마일리지 수동 분배 로직을 전부 제거**하고 이 API로 교체 — 결제창 1번, 백엔드가 쿠폰/마일리지를 패키지분에만 자동 적용 / 영향: `src/features/packagelounge/types.ts`(`CreateBundlePaymentRequest`/`BundlePaymentResponse` 추가), `src/features/services/package.service.ts`(`createBundlePayment` 추가), `src/features/packagelounge/hooks/usePackagePayment.ts`(`handlePay` 대폭 단순화). **미반영**: `courseIds`가 `minItems:1`이라 강의 없는 예약엔 이 API를 못 써서 기존 `POST /payments`와 분기 유지 중, 분할 결제(1차/2차) UI는 여전히 다음 작업 대상
- 2026-07-19 — 마이페이지 "내 정보 수정" 진입 게이트를 비밀번호 인증 → 이메일 인증(`POST /users/me/email/send-code`, `POST /users/me/email/verify`)으로 전환하는 작업 마무리. 서비스/타입(`mypage.service.ts`, `types.ts`)과 새 모달(`EmailAuthVerifyModal.tsx`)은 이미 완성돼 있었고, `src/app/(user)/mypage/page.tsx`가 옛날 `PasswordVerifyModal`/`isPasswordModalOpen`(이미 삭제된 state)을 여전히 참조해 빌드가 깨져 있던 것만 `EmailAuthVerifyModal`/`isEmailAuthModalOpen`으로 교체. 더 이상 안 쓰이고 빌드를 깨던 `PasswordVerifyModal.tsx`는 삭제 / 영향: `src/app/(user)/mypage/page.tsx`, `src/features/mypage/PasswordVerifyModal.tsx`(삭제)
