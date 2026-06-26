import {
  createRegisterPayload,
  REGISTER_REQUIRED_EMAIL_MESSAGE,
  REGISTER_REQUIRED_NAME_MESSAGE,
  REGISTER_REQUIRED_NICKNAME_MESSAGE,
  REGISTER_REQUIRED_PASSWORD_MESSAGE,
  REGISTER_REQUIRED_USERNAME_MESSAGE,
  REGISTER_INVALID_EMAIL_MESSAGE,
  REGISTER_EMAIL_VERIFY_MESSAGE,
  REGISTER_INVALID_PHONE_MESSAGE,
  REGISTER_PASSWORD_CONFIRM_MESSAGE,
  REGISTER_REQUIRED_BIRTH_DATE_MESSAGE,
  REGISTER_REQUIRED_GENDER_MESSAGE,
  REGISTER_USERNAME_CHECK_MESSAGE,
  validateRegisterEmail,
  validateRegisterInfoForm,
  validateRegisterName,
  validateRegisterNickname,
  validateRegisterPassword,
  validateRegisterUsername,
} from "@/features/auth/utils/registerValidators";
import type { RegisterFormData } from "@/features/auth/types";

const createValidRegisterFormData = (
  override: Partial<RegisterFormData> = {}
): RegisterFormData => ({
  name: "김알고",
  username: "testuser",
  password: "password123",
  passwordConfirm: "password123",
  email: "test@example.com",
  phone: "010-1234-5678",
  birthDate: "2000-01-01",
  gender: "FEMALE",
  nickname: "알고가조아",
  socialType: "",
  referralCode: "",
  signupPath: "search",
  termsServiceAgreed: true,
  termsPrivacyAgreed: true,
  termsMarketingAgreed: false,
  ...override,
});

describe("회원가입 유효성 검사 단위 테스트", () => {
  test("이름이 비어 있으면 이름 필수 메시지를 반환한다", () => {
    const result = validateRegisterName("");

    expect(result).toBe(REGISTER_REQUIRED_NAME_MESSAGE);
  });

  test("이름이 입력되어 있으면 빈 문자열을 반환한다", () => {
    const result = validateRegisterName("김알고");

    expect(result).toBe("");
  });

  test("아이디가 비어 있으면 아이디 필수 메시지를 반환한다", () => {
    const result = validateRegisterUsername("");

    expect(result).toBe(REGISTER_REQUIRED_USERNAME_MESSAGE);
  });

  test("아이디가 4자 미만이면 아이디 필수 메시지를 반환한다", () => {
    const result = validateRegisterUsername("abc");

    expect(result).toBe(REGISTER_REQUIRED_USERNAME_MESSAGE);
  });

  test("아이디가 정상 입력되면 빈 문자열을 반환한다", () => {
    const result = validateRegisterUsername("testuser");

    expect(result).toBe("");
  });

  test("비밀번호가 비어 있으면 비밀번호 필수 메시지를 반환한다", () => {
    const result = validateRegisterPassword("");

    expect(result).toBe(REGISTER_REQUIRED_PASSWORD_MESSAGE);
  });

  test("비밀번호가 8자 미만이면 비밀번호 필수 메시지를 반환한다", () => {
    const result = validateRegisterPassword("1234567");

    expect(result).toBe(REGISTER_REQUIRED_PASSWORD_MESSAGE);
  });

  test("비밀번호가 정상 입력되면 빈 문자열을 반환한다", () => {
    const result = validateRegisterPassword("password123");

    expect(result).toBe("");
  });

  test("이메일이 비어 있으면 이메일 필수 메시지를 반환한다", () => {
    const result = validateRegisterEmail("");

    expect(result).toBe(REGISTER_REQUIRED_EMAIL_MESSAGE);
  });

  test("이메일 형식이 올바르지 않으면 이메일 형식 메시지를 반환한다", () => {
    const result = validateRegisterEmail("test-email");

    expect(result).toBe(REGISTER_INVALID_EMAIL_MESSAGE);
  });

  test("이메일이 정상 입력되면 빈 문자열을 반환한다", () => {
    const result = validateRegisterEmail("test@example.com");

    expect(result).toBe("");
  });

  test("닉네임이 비어 있으면 닉네임 필수 메시지를 반환한다", () => {
    const result = validateRegisterNickname("");

    expect(result).toBe(REGISTER_REQUIRED_NICKNAME_MESSAGE);
  });

  test("닉네임이 정상 입력되면 빈 문자열을 반환한다", () => {
    const result = validateRegisterNickname("알고가조아");

    expect(result).toBe("");
  });

  test("회원가입 값이 정상 입력되면 요청 payload를 만든다", () => {
    const result = createRegisterPayload({
      name: " 김알고 ",
      username: " testuser ",
      password: "password123",
      passwordConfirm: "password123",
      email: "test@example.com",
      nickname: " 알고가조아 ",
    });

    expect(result).toMatchObject({
      name: "김알고",
      username: "testuser",
      password: "password123",
      passwordConfirm: "password123",
      email: "test@example.com",
      nickname: "알고가조아",
    });
  });

  test("필수 값이 없으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "",
        username: "",
        password: "",
        passwordConfirm: "",
        email: "",
        nickname: "",
      })
    ).toThrow();
  });

  test("아이디가 올바르지 않으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "김알고",
        username: "abc",
        password: "password123",
        passwordConfirm: "password123",
        email: "test@example.com",
        nickname: "알고가조아",
      })
    ).toThrow(REGISTER_REQUIRED_USERNAME_MESSAGE);
  });

  test("비밀번호가 올바르지 않으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "김알고",
        username: "testuser",
        password: "1234567",
        passwordConfirm: "1234567",
        email: "test@example.com",
        nickname: "알고가조아",
      })
    ).toThrow(REGISTER_REQUIRED_PASSWORD_MESSAGE);
  });

  test("이메일이 올바르지 않으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "김알고",
        username: "testuser",
        password: "password123",
        passwordConfirm: "password123",
        email: "test-email",
        nickname: "알고가조아",
      })
    ).toThrow(REGISTER_INVALID_EMAIL_MESSAGE);
  });

  test("닉네임이 올바르지 않으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "김알고",
        username: "testuser",
        password: "password123",
        passwordConfirm: "password123",
        email: "test@example.com",
        nickname: "",
      })
    ).toThrow(REGISTER_REQUIRED_NICKNAME_MESSAGE);
  });

  test("비밀번호 확인이 일치하지 않으면 에러가 발생한다", () => {
    expect(() =>
      createRegisterPayload({
        name: "김알고",
        username: "testuser",
        password: "password123",
        passwordConfirm: "password456",
        email: "test@example.com",
        nickname: "알고가조아",
      })
    ).toThrow(REGISTER_PASSWORD_CONFIRM_MESSAGE);
  });

  test("일반 회원가입 값이 모두 정상이고 중복 확인과 이메일 인증이 끝나면 에러가 없다", () => {
    const result = validateRegisterInfoForm(createValidRegisterFormData(), {
      isUsernameChecked: true,
      isEmailVerified: true,
    });

    expect(result).toEqual({});
  });

  test("비밀번호 확인이 다르면 passwordConfirm 에러를 반환한다", () => {
    const result = validateRegisterInfoForm(
      createValidRegisterFormData({ passwordConfirm: "password456" }),
      {
        isUsernameChecked: true,
        isEmailVerified: true,
      }
    );

    expect(result.passwordConfirm).toBe(REGISTER_PASSWORD_CONFIRM_MESSAGE);
  });

  test("아이디 중복 확인을 하지 않으면 username 에러를 반환한다", () => {
    const result = validateRegisterInfoForm(createValidRegisterFormData(), {
      isUsernameChecked: false,
      isEmailVerified: true,
    });

    expect(result.username).toBe(REGISTER_USERNAME_CHECK_MESSAGE);
  });

  test("이메일 인증을 하지 않으면 email 에러를 반환한다", () => {
    const result = validateRegisterInfoForm(createValidRegisterFormData(), {
      isUsernameChecked: true,
      isEmailVerified: false,
    });

    expect(result.email).toBe(REGISTER_EMAIL_VERIFY_MESSAGE);
  });

  test("전화번호 형식이 올바르지 않으면 phone 에러를 반환한다", () => {
    const result = validateRegisterInfoForm(
      createValidRegisterFormData({ phone: "01012345678" }),
      {
        isUsernameChecked: true,
        isEmailVerified: true,
      }
    );

    expect(result.phone).toBe(REGISTER_INVALID_PHONE_MESSAGE);
  });

  test("생년월일과 성별이 없으면 각각 에러를 반환한다", () => {
    const result = validateRegisterInfoForm(
      createValidRegisterFormData({ birthDate: "", gender: "" }),
      {
        isUsernameChecked: true,
        isEmailVerified: true,
      }
    );

    expect(result.birthDate).toBe(REGISTER_REQUIRED_BIRTH_DATE_MESSAGE);
    expect(result.gender).toBe(REGISTER_REQUIRED_GENDER_MESSAGE);
  });

  test("소셜 회원가입이면 아이디, 비밀번호, 이메일 인증 검사를 건너뛴다", () => {
    const result = validateRegisterInfoForm(
      createValidRegisterFormData({
        username: "",
        password: "",
        passwordConfirm: "",
      }),
      {
        isSocialSignup: true,
        isUsernameChecked: false,
        isEmailVerified: false,
      }
    );

    expect(result.username).toBeUndefined();
    expect(result.password).toBeUndefined();
    expect(result.passwordConfirm).toBeUndefined();
    expect(result.email).toBeUndefined();
  });
});
