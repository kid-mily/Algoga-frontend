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
- 403 `BK_004`("해당 국가의 강의를 완강해야 패키지를 예약할 수 있습니다") 시 공통 에러 문구 대신 전용 안내 + `/mypage/coursedetails`(강의 이어듣기) 링크 표시 (`BookingPrice.tsx`의 `isCompletionRequired`, 2026-07-20 PR #584)

#### Notes

- 400 `BK_003`(예약 가능한 패키지가 없음) 등 세부 에러 코드별 안내 문구는 아직 미분기 처리 — 공통 에러 문구만 표시 중
- 2026-07-20 (PR #584) — 강의를 구매했지만 완강하지 않은 유저의 패키지 예약을 막는 `BK_004` 검사 추가. `bookingSource`(LOUNGE/COMPLETION) 값과 무관하게 항상 검사되며, `bookingSource`는 이제 분할/일시불 허용 여부(`installmentAllowed`)만 결정함

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

- `bookingId`, `paymentType`(`"FULL"` 일시불 / `"DEPOSIT"` 예약금 분할 — 결제 페이지의 결제 방식 토글로 선택, `installmentAllowed: false`면 `DEPOSIT` 선택 자체를 막고 `FULL` 고정), `amount`(`finalAmount`), `usedMileage`, `usedCouponId`, `portonePaymentId`
- `courseIds`: `[courseId]` — **minItems 1이라 빈 배열을 보낼 수 없음.** 그래서 강의가 없는 경우는 아예 이 API를 호출하지 않고 기존 `POST /payments`로 분기
- **`amount` 계산 공식(2026-07-20 사용자 제공 가이드 기준)**: `amount = 패키지분 + 강의 정가 합계 - 쿠폰할인 - 마일리지`
  - 패키지분: `paymentType`이 `DEPOSIT`이면 `booking.depositPrice`, `FULL`이면 `booking.totalPrice`
  - 강의: 분할 없음, 항상 정가 전액 그대로 더함
  - 쿠폰/마일리지: **패키지분에서만 차감**(강의 금액에는 적용 안 됨) — `usePackagePayment.ts`에서 `couponDiscount`/`maxMileage`/`finalAmount`를 모두 패키지분(`packageAmount`) 기준으로 계산하도록 수정함

#### Response Fields Used

- `data`: `BundlePaymentResponse` — `bookingPaymentId`, `lecturePaymentIds`, `bookingAmount`, `lectureAmount`, `totalAmount`. 현재 화면에서는 결제 완료 페이지로 이동만 하고 이 값들은 별도로 사용하지 않음

#### Error Handling

- `PAYMENT_ERROR_MESSAGE`(`usePackagePayment.ts`)에 `PAY_007`(강의 없음), `PAY_015`(일시불만 가능한 예약), `PAY_016`(통합 결제는 DEPOSIT/FULL만 허용) 추가

#### Notes

- **이 API 도입 전엔 토스페이 결제창을 2번 띄우고 `POST /payments` + `POST /payments/lecture`를 따로 호출하는 우회 구조였음** (2026-07-17 항목 참고). PortOne 실제 승인액과 각 API에 보내는 amount가 안 맞아 `PAY_003`이 나던 문제가 있었는데, 이 통합 API로 바뀌면서 결제창 1번 + 백엔드가 내부적으로 쿠폰/마일리지를 패키지분에만 적용해 나눠주는 구조로 완전히 대체됨 → **프론트의 수동 분배 계산 로직은 전부 제거함**
- 완강 후 예약(`installmentAllowed: false`)은 `FULL`만 가능, 이미 결제한 강의(`isPaid: true`)를 `courseIds`에 넣으면 `PAY_004`(중복 결제)
- 2026-07-20: `paymentType`을 `"FULL"` 고정에서 결제 페이지의 토글(일시불/예약금)로 선택 가능하도록 변경, 그에 맞춰 `amount` 계산식도 위 공식대로 수정(쿠폰/마일리지가 패키지분에서만 차감되도록). `usedMileage`가 패키지분(`packageAmount`)보다 커지지 않도록 `maxMileage`도 패키지분 기준으로 재계산 / 영향: `src/features/packagelounge/hooks/usePackagePayment.ts`, `src/features/packagelounge/components/PackagePaymentClient.tsx`, `src/features/packagelounge/components/PaymentSummary.tsx`. **여전히 courseIds는 강의 1개(`[courseId]`)만 지원** — 강의 여러 개 선택(`GET /courses/countries/{countryId}` 연동, 다중 선택 UI)은 이번 범위 밖, 다음 작업 대상
- 2026-07-20 (PR #584, 후속) — 이 API를 호출하기 전에 `GET /payments/bundle/preview`로 먼저 사전 검증하도록 변경 (아래 항목 참고). `amount`는 더 이상 프론트가 `finalAmount`를 직접 계산해 보내지 않고, preview 응답의 `expectedTotal`을 그대로 사용함

---

### GET /api/v1/payments/bundle/preview

#### Used In

- `src/features/services/package.service.ts` (`getBundlePaymentPreview`) — `usePackagePayment.ts`의 `handlePay`에서, courseId가 있을 때 PortOne 결제창을 띄우기 전 필수로 먼저 호출

#### Request Fields

- `bookingId`, `courseIds`(`[courseId]`), `paymentType`(`DEPOSIT`/`FULL`), `usedMileage`, `usedCouponId`
- **주의**: `courseIds`는 원래 `?courseIds=1&courseIds=2`처럼 반복 쿼리로 여러 개를 받을 수 있지만, `lib/api.ts`의 `params`가 배열을 반복 쿼리로 못 만들어서(콤마 문자열이 됨, 공통 파일이라 수정 안 함) 현재 프론트가 강의 1개만 지원하는 범위에서는 `courseIds[0]` 값 하나만 보냄 — 다중 강의 지원 시 `lib/api.ts` 수정이나 별도 직렬화가 필요

#### Response Fields Used

- `data`: `BundlePaymentPreview` — `payable`, `blockReason`, `blockMessage`, `alreadyPaidCourseIds`, `packageAmount`, `lectureAmount`, `expectedTotal`
- 이 API는 항상 HTTP 200이라 `data.payable`로만 분기함 (`ApiRequestError`로 안 잡힘)

#### Error Handling

- `payable: false`이고 `blockReason === "DUPLICATE_PAYMENT"`이며 `alreadyPaidCourseIds`에 선택한 강의가 포함되면, 강의를 빼고 패키지만(`POST /payments`) 결제하는 걸로 자동 전환 — 프론트가 강의 1개만 지원해서 "제외 후 재시도" 없이 바로 패키지 단독 결제로 폴백
- 그 외 `blockReason`(`INSTALLMENT_NOT_ALLOWED`/`INVALID_PAYMENT_TYPE`/`BOOKING_NOT_FOUND`/`COURSE_NOT_FOUND`/`COUPON_INVALID`/`INSUFFICIENT_MILEAGE`/`INVALID_PAYMENT_AMOUNT`)는 서버가 내려주는 `blockMessage`를 그대로 에러 문구로 표시(별도 매핑 테이블 없음)하고 결제창 자체를 띄우지 않음

#### Notes

- `payable: true`면 이후 PortOne 결제 금액과 `POST /payments/bundle`의 `amount`에 `expectedTotal`을 그대로 사용 (프론트가 재계산 안 함)
- preview 통과 후에도 다른 탭에서 같은 강의를 결제하는 등 레이스 컨디션으로 `POST /payments/bundle`이 여전히 `PAY_004`를 낼 수 있음 — 기존 에러 문구 매핑으로 처리됨(추가 대응 없음)

---

### GET /api/v1/my/courses

#### Used In

- `src/features/services/myCourse.service.ts` (`getMyCourses`) — 마이페이지 수강 내역(`coursedetails`), 강의 완강 상태 표시(`useCourseCompletionStatus`)
- `src/features/classroom/evaluation/EvaluationResultContent.tsx`(`handlePackageClick`) — 진단평가 결과에서 "패키지 선택" 클릭 시, `POST /bookings`의 `BK_004`(완강 안 한 나라는 예약 불가)와 같은 조건을 예약 생성 전에 미리 확인해 페이지 이동 자체를 막음 (2026-07-20 추가)

#### Response Fields Used

- `data.content[]`: `MyCourse` — `courseId`, `countryId`, `learningStatus`(`IN_PROGRESS`/`COMPLETED`) 위주로 사용. 완강 여부 판정은 `isMyCourseCompleted(course)`(`myCourse.service.ts`) 공용 헬퍼 재사용

#### Notes

- `EvaluationResultContent.tsx`에서는 `countryId`가 일치하는 항목을 전부 걸러서 하나라도 `COMPLETED`가 아니면 차단(`completionBlocked`) + `/mypage/coursedetails` 링크 표시. 그 나라 강의를 산 적이 없으면(목록에 없으면) 통과시켜 패키지+강의 동시 구매 흐름은 막지 않음
- 이 사전 체크는 `page=0, size=100`로 한 번에 가져오는 방식이라(기존 `useCourseCompletionStatus`와 동일 패턴) 강의 수가 100개를 넘는 유저는 놓칠 수 있음 — 프론트 임시 체크일 뿐이고, 최종 차단은 어차피 `POST /bookings`의 `BK_004`가 담당하므로 조회 실패/누락 시에도 페이지 이동은 막지 않음(에러는 콘솔 로그만)

#### Used In

- `src/features/services/package.service.ts` (`getMyBookings`) — 마이페이지 예약 내역(`src/features/mypage/reservations/reservation.util.ts`의 `loadMyReservations`), "이용 전"/"이용 후" 탭

#### Response Fields Used

- `BookingDetail[]` — `GET /bookings/{id}`와 동일한 응답 형태(`toBookingDetail` 공유, `flightInfo`/`returnFlightInfo`/`passengerInfo` JSON 문자열 파싱 동일)

#### Error Handling

- 실패 시 목록 화면에 에러 문구 표시 (`ReservationPage.tsx`의 `loadErrorMessage`)

#### Notes

- **이 API 응답엔 상품명/숙소명이 없음** (accommodationId만 있음) — 화면에 보여줄 숙소명은 `GET /accommodations/{id}`를 accommodationId별로 추가 조회해서 채움 (`loadMyReservations`)
- 백엔드 `status`(`PENDING/DEPOSIT_PAID/FULL_PAID/CANCEL_REQUESTED/REFUNDED`)엔 "이용 완료" 개념이 없어서, **체크아웃 날짜를 오늘과 비교해 이용 전/이용 후를 프론트가 직접 계산**(`reservation.util.ts`의 `resolveReservationStatus`)
- `CANCEL_REQUESTED`/`REFUNDED` 상태 예약은 "이용 전"/"이용 후" 목록에서 제외하고 환불 내역 탭으로 보냄 (아래 `GET /refund-requests/me` 참고)
- `PassengerInfo`엔 성별/국적이 없어서 상세 화면에 표시할 값이 없음 (`"-"`로 표시)
- 2026-07-20 — `PENDING`(예약만 생성되고 결제가 끝나지 않은 건) 상태도 "이용 전"/"이용 후" 목록에서 제외하도록 변경(`resolveReservationStatus`). 원인: 예약 생성(`POST /bookings`)이 실제 결제보다 먼저 일어나는 구조라, 결제 페이지까지 갔다가 이탈한 예약이 실제 결제 기록 없이 그대로 "예약 완료"처럼 노출되고 있었음 — 이 상태에서 "환불 요청"을 누르면 `GET /payments/me`에 해당 bookingId의 결제가 없어 `submitRefundRequest`가 항상 실패했음(실제 버그 사례로 확인). 상세 페이지(`loadMyReservationDetail`)도 동일하게 PENDING 예약은 null 처리 후 환불 요청 목록에서 못 찾으면 "예약 정보를 찾을 수 없습니다"로 표시됨 / 영향: `src/features/mypage/reservations/reservation.util.ts`

---

### GET /api/v1/refund-requests/me

#### Used In

- `src/features/services/refund.service.ts` (`getMyRefundRequests`) — 마이페이지 예약 내역(`reservation.util.ts`의 `loadMyReservations`/`loadMyReservationDetail`), "환불 내역" 탭

#### Response Fields Used

- `data[]`: `RefundRequestRecord` — `refundId`, `bookingId`, `paymentId`, `status`(`REQUESTED`/`UPPER_REVIEW`/`UNDER_REVIEW`/`APPROVED`/`REJECTED`/`COMPLETED`), `reason`, `rejectReason`, `amount`, `createdAt`, `updatedAt`, `productName`, `bookingNumber`, `checkInDate`, `paidAmount`, `paymentMethod` (2026-07-20 사용자 제공 Swagger 응답 예시 기준)
- 여행 일정/항공/숙소 정보가 이 응답엔 없어서, 화면 표시용으로 `bookingId`로 `GET /bookings/{id}` + `GET /accommodations/{id}`를 추가 조회해서 보강함(`toRefundReservationItem`). 이 조회가 실패해도(예: 이미 오래돼 접근 불가 등) 환불 정보 자체는 그대로 보여줌

#### Notes

- `status`를 화면 3단계로 매핑: `COMPLETED` → `refunded`, `REJECTED` → `refund_rejected`, 나머지(`REQUESTED`/`UPPER_REVIEW`/`UNDER_REVIEW`/`APPROVED`)는 전부 `refund_pending`("환불 처리 중")으로 묶음
- 2026-07-20 — 마이페이지 예약 내역의 "환불 내역" 탭에 있던 더미 데이터(`DUMMY_RESERVATIONS`, sessionStorage 기반 `getReservationsWithSessionState`)를 완전히 제거하고 이 API로 교체 / 영향: `src/features/services/refund.service.ts`(신규), `src/features/mypage/reservations/reservation.util.ts`, `src/features/mypage/reservations/reservation.data.ts`(더미 제거, `getRefundRate`/`getRefundReasonError`만 남김), `src/features/mypage/reservations/ReservationPage.tsx`, `src/features/mypage/reservations/ReservationDetail.tsx`
- 2026-07-20 (후속) — "환불 요청" 버튼의 쓰기 경로(`DELETE /bookings/{id}/cancel` → `POST /refund-requests`)까지 실제로 연동함. 막혀 있던 `paymentId` 조회는 `GET /payments/me`(사용자 제공 Swagger 응답으로 확인, 아래 항목 참고)로 내 결제 목록 전체를 가져와 `bookingId`로 필터링해서 구함(예약금+잔금처럼 결제가 여러 건이면 `createdAt` 기준 최신 건 사용) / 영향: `src/features/services/package.service.ts`(`getMyPayments` 추가), `src/features/services/refund.service.ts`(`cancelBooking`, `createRefundRequest` 추가), `src/features/mypage/reservations/reservation.util.ts`(`submitRefundRequest` 헬퍼로 취소+환불요청+에러 매핑을 한 번에 처리), `src/features/mypage/reservations/RefundRequestModal.tsx`(내부 `submitting` state 제거하고 부모가 `isSubmitting`/`errorMessage`를 props로 제어하도록 변경), `src/features/mypage/reservations/ReservationPage.tsx`, `src/features/mypage/reservations/ReservationDetail.tsx`. 성공/실패 여부와 무관하게 요청 후 `loadMyReservations`/`loadMyReservationDetail`을 다시 호출해 실제 서버 상태로 갱신함(로컬 state를 수동으로 patch하지 않음)
- 에러 코드 매핑(`reservation.util.ts`의 `REFUND_ERROR_MESSAGE`): `BK_001`/`REF_002`(예약 없음), `REF_004`(이미 환불 요청됨), `REF_006`(취소된 예약만 환불 요청 가능). 결제 내역 자체를 못 찾으면(`GET /payments/me`에 해당 bookingId가 없으면) "고객센터로 문의해 주세요" 문구로 안내하고 취소/환불 요청 자체를 시도하지 않음

---

### GET /api/v1/payments/me

#### Used In

- `src/features/services/package.service.ts` (`getMyPayments`) — `reservation.util.ts`의 `submitRefundRequest`에서 환불 요청에 필요한 `paymentId`를 `bookingId`로 역조회할 때만 사용

#### Response Fields Used

- `data[]`: `PaymentDetail`과 동일한 형태(`paymentId`, `bookingId`, `courseId`, `userId`, `paymentType`, `amount`, `usedMileage`, `usedCouponId`, `status`, `portonePaymentId`, `createdAt`, `userName`, `productName`, `paymentMethod`) — 2026-07-20 사용자 제공 Swagger 응답 예시로 확인

#### Notes

- 원래 `src/features/services/SinglePayment.service.ts`에 같은 이름으로 주석 처리된 채 방치돼 있던 걸 발견해서 재작성함 (그 파일 것과 무관하게 `package.service.ts`에 새로 구현, 커밋 없이 죽은 코드로만 남아있던 것)
- 예약당 결제가 여러 건일 수 있어(분할 결제의 예약금+잔금 등) `bookingId`로 필터링한 뒤 `createdAt`이 가장 최근인 것을 사용함 — 정확히 어떤 결제를 골라야 하는지는 백엔드 확정 스펙이 아니라 프론트 임시 판단이라 주의

---

### DELETE /api/v1/bookings/{bookingId}/cancel

#### Used In

- `src/features/services/refund.service.ts` (`cancelBooking`) — 환불 요청(`submitRefundRequest`)의 첫 단계. 성공 후 바로 `POST /refund-requests`를 이어서 호출함

#### Error Handling

- 404 `BK_001`("예약을 찾을 수 없습니다") — `REFUND_ERROR_MESSAGE`에 매핑

---

### POST /api/v1/refund-requests

#### Used In

- `src/features/services/refund.service.ts` (`createRefundRequest`) — `cancelBooking` 성공 직후 호출

#### Request Fields

- `bookingId`, `paymentId`(`GET /payments/me`로 조회), `reason`

#### Response Fields Used

- `data`: number — 생성된 `refundId`. 현재 화면에서는 별도로 사용하지 않고, 요청 성공 후 예약 목록/상세를 다시 불러와 반영함

#### Error Handling

- 400 `REF_006`("취소된 예약만 환불 요청이 가능합니다"), 404 `REF_002`("예약 정보를 찾을 수 없습니다"), 409 `REF_004`("이미 환불 요청된 예약입니다") — `REFUND_ERROR_MESSAGE`에 매핑(사용자 제공 Swagger 예시 기준)

---

### DELETE /api/v1/users/me

#### Used In

- `src/features/services/mypage.service.ts` (`withdrawMyAccount`) — 회원 탈퇴 페이지(`src/features/mypage/withdraw/WithdrawPageClient.tsx`, `src/app/(user)/mypage/withdraw/page.tsx`)의 "탈퇴하기" 버튼

#### Request Fields

- 바디 없음. 단, 호출 전 반드시 `POST /users/me/email/send-code` + `POST /users/me/email/verify`로 본인확인을 마쳐야 함(30분 유효, 정보수정/비밀번호변경과 인증을 공유)

#### Error Handling

- `AUTH_014`(본인확인 안 함/만료) / `USER_007`(이미 탈퇴한 계정) / `USER_010`(진행 중인 예약 존재) / `USER_011`(진행 중인 환불 존재) — `error.body?.errorCode`(없으면 `error.code`) 기준으로 안내 문구 분기(`WithdrawPageClient.tsx`의 `WITHDRAW_ERROR_MESSAGE`), 결제 페이지(`usePackagePayment.ts`)와 동일한 패턴
- 성공 시 서버가 accessToken/refreshToken 쿠키를 자동 삭제 — 프론트는 남아있을 수 있는 legacy localStorage 토큰만 정리하고 `auth-state-changed` 이벤트 발행 후 메인 페이지로 이동

#### Notes

- 사용자 제공 명세상 원래는 "비밀번호 재입력 확인" 플로우였으나, API 자체가 이메일 인증 필수로 변경되어 있어(2026-07-19 정보수정 게이트 전환과 동일한 방식) 비밀번호가 아닌 기존 `EmailAuthVerifyModal` 재사용으로 구현함
- 수강 중인 강좌가 있으면(마이페이지 요약의 `courseCount`) 탈퇴 확인 팝업에 "학습 진행 내역이 모두 사라진다"는 경고 문구를 추가로 보여줌 — 이건 서버 차단이 아니라 프론트 안내 문구일 뿐, 실제 차단은 `USER_010`/`USER_011`(예약/환불)만 해당

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
- 2026-07-20 — 회원 탈퇴 페이지 신규 구현. `DELETE /api/v1/users/me`가 이번에 이메일 인증 필수로 바뀌어(사용자 제공 명세 기준), 마이페이지 메인의 "회원 탈퇴하기" 버튼 → `/mypage/withdraw` 이동 → 안내/경고 확인 팝업 → 기존 `EmailAuthVerifyModal` 재사용으로 본인확인 → 탈퇴 API 호출 → 성공 시 메인 페이지 이동 순서로 구현. 상세는 위 Used Endpoints 섹션 참고. 백엔드 실제 동작(에러 응답의 `errorCode` 필드명, 탈퇴 후 실제 쿠키 삭제 여부)은 로컬에 로그인 가능한 테스트 계정이 없어 아직 실제 API 호출로는 검증 못 함(lint/타입체크만 확인) / 영향: `src/features/services/mypage.service.ts`(`withdrawMyAccount` 추가), `src/features/mypage/withdraw/WithdrawPageClient.tsx`(신규), `src/app/(user)/mypage/withdraw/page.tsx`(신규), `src/app/(user)/mypage/page.tsx`
- 2026-07-20 — `POST /api/v1/payments/bundle` 요청을 사용자 제공 "패키지+강의 통합 결제 연동 가이드"에 맞춰 수정. (1) `paymentType`을 `"FULL"` 고정에서 결제 페이지의 일시불/예약금 토글로 선택하도록 변경(`installmentAllowed: false`인 예약은 토글에서 `DEPOSIT` 비활성화). (2) `amount` 계산식을 가이드 공식(`패키지분(depositPrice|totalPrice) + 강의 정가 - 쿠폰할인 - 마일리지`, 쿠폰/마일리지는 패키지분에서만 차감)에 맞게 수정 — 기존엔 쿠폰/마일리지가 패키지+강의 합산 금액 전체에서 차감돼 가이드와 어긋나 있었음. `courseId`가 없는 경우 쓰는 기존 `POST /payments`도 동일한 `paymentType`/`amount` 로직을 공유하도록 함께 수정 / 영향: `src/features/packagelounge/hooks/usePackagePayment.ts`, `src/features/packagelounge/components/PackagePaymentClient.tsx`, `src/features/packagelounge/components/PaymentSummary.tsx`. 실제 로그인 세션으로 결제창까지 눌러보는 E2E 검증은 로컬에 테스트 계정/예약 데이터가 없어 못 함(lint/타입체크만 확인) — **미반영**: 강의 여러 개 선택(`courseIds` 다중, `GET /courses/countries/{countryId}` 연동)은 이번 범위 밖
