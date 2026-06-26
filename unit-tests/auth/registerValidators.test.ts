import {
  createRegisterPayload,
  REGISTER_REQUIRED_EMAIL_MESSAGE,
  REGISTER_REQUIRED_NAME_MESSAGE,
  REGISTER_REQUIRED_NICKNAME_MESSAGE,
  REGISTER_REQUIRED_PASSWORD_MESSAGE,
  REGISTER_REQUIRED_USERNAME_MESSAGE,
  REGISTER_INVALID_EMAIL_MESSAGE,
  validateRegisterEmail,
  validateRegisterName,
  validateRegisterNickname,
  validateRegisterPassword,
  validateRegisterUsername,
} from "@/features/auth/utils/registerValidators";

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
    ).toThrow("비밀번호가 일치하지 않습니다.");
  });
});
