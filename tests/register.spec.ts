import { test, expect } from "@playwright/test";

test.describe("회원가입 플로우", () => {
  test("회원가입 페이지가 정상적으로 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/register");

    // Then
    await expect(page.getByText("알고가 회원가입")).toBeVisible();
    await expect(page.getByRole("heading", { name: "기본 정보 입력" })).toBeVisible();
  });

  test("필수 정보를 입력하지 않으면 에러 메시지가 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/register");

    // When
    await page.getByRole("button", { name: "다음 단계로 이동" }).click();

    // Then
    await expect(page.getByText("이름은 필수입니다.")).toBeVisible();
    await expect(page.getByText("아이디는 4자 이상 20자 이하로 입력해주세요.")).toBeVisible();
    await expect(page.getByText("비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.")).toBeVisible();
    await expect(page.getByText("올바른 이메일 형식을 입력해주세요.")).toBeVisible();
    await expect(page.getByText("닉네임은 필수이며 50자 이내여야 합니다.")).toBeVisible();
  });

  test("비밀번호와 비밀번호 확인이 다르면 에러 메시지가 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/register");

    // When
    await page.getByPlaceholder("홍길동").fill("김알고");
    await page.getByPlaceholder("4자 이상 20자 이하").fill("algogauser");
    await page.getByPlaceholder("8자 이상 영문, 숫자 조합").fill("password123");
    await page.getByPlaceholder("재입력").fill("different123");
    await page.getByPlaceholder("사용하실 닉네임을 입력해주세요").fill("알고가조아");
    await page.getByPlaceholder("example@algoga.com").fill("test@algoga.com");
    await page.getByPlaceholder("010-0000-0000").fill("01012345678");

    await page.locator('input[type="date"]').fill("2000-01-01");
    await page.locator("select").first().selectOption("MALE");

    await page.getByRole("button", { name: "다음 단계로 이동" }).click();

    // Then
    await expect(page.getByText("비밀번호가 일치하지 않습니다.")).toBeVisible();
  });

  test("일반 회원가입에서 아이디 중복 확인을 하지 않으면 다음 단계로 이동할 수 없다", async ({ page }) => {
    // Given
    await page.goto("/auth/register");

    // When
    await page.getByPlaceholder("홍길동").fill("김알고");
    await page.getByPlaceholder("4자 이상 20자 이하").fill("algogauser");
    await page.getByPlaceholder("8자 이상 영문, 숫자 조합").fill("password123");
    await page.getByPlaceholder("재입력").fill("password123");
    await page.getByPlaceholder("사용하실 닉네임을 입력해주세요").fill("알고가조아");
    await page.getByPlaceholder("example@algoga.com").fill("test@algoga.com");
    await page.getByPlaceholder("010-0000-0000").fill("01012345678");

    await page.locator('input[type="date"]').fill("2000-01-01");
    await page.locator("select").first().selectOption("MALE");

    await page.getByRole("button", { name: "다음 단계로 이동" }).click();

    // Then
    await expect(page.getByText("아이디 중복 확인을 완료해주세요.")).toBeVisible();
    await expect(page.getByText("이메일 인증을 완료해주세요.")).toBeVisible();
  });

  test("소셜 회원가입 정보 입력 후 약관 동의 단계로 이동한다", async ({ page }) => {
    // Given: 백엔드가 소셜 신규 회원을 이 주소로 보내주는 상황
    await page.goto(
      "/auth/register?email=test_social@algoga.com&name=김알고&socialType=GOOGLE"
    );

    // When
    await page.getByPlaceholder("사용하실 닉네임을 입력해주세요").fill("알고가조아");
    await page.getByPlaceholder("010-0000-0000").fill("01012345678");

    await page.locator('input[type="date"]').fill("2000-01-01");
    await page.locator("select").first().selectOption("MALE");

    await page.getByRole("button", { name: "다음 단계로 이동" }).click();

    // Then
    await expect(page.getByRole("heading", { name: "약관 동의" })).toBeVisible();
  });

  test("약관 동의 단계에서 필수 약관을 동의해야 다음 버튼이 활성화된다", async ({ page }) => {
    // Given
    await page.goto(
      "/auth/register?email=test_social@algoga.com&name=김알고&socialType=GOOGLE"
    );

    await page.getByPlaceholder("사용하실 닉네임을 입력해주세요").fill("알고가조아");
    await page.getByPlaceholder("010-0000-0000").fill("01012345678");
    await page.locator('input[type="date"]').fill("2000-01-01");
    await page.locator("select").first().selectOption("MALE");

    await page.getByRole("button", { name: "다음 단계로 이동" }).click();

    // Then: 처음에는 다음 버튼 비활성화
    await expect(page.getByRole("button", { name: "다음" })).toBeDisabled();

    // When: 필수 약관 동의
    await page.getByLabel("[필수] 이용약관 동의").check();
    await page.getByLabel("[필수] 개인정보 처리방침 동의").check();

    // Then
    await expect(page.getByRole("button", { name: "다음" })).toBeEnabled();
  });
});