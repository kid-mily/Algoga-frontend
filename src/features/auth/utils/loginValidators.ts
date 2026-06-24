export const LOGIN_REQUIRED_USERNAME_MESSAGE = "아이디를 입력해주세요.";
export const LOGIN_REQUIRED_PASSWORD_MESSAGE = "비밀번호를 입력해주세요.";
export const LOGIN_FAILED_MESSAGE = "아이디 또는 비밀번호가 틀렸습니다.";

export const validateLoginUsername = (username: string) => {
  return username.trim() ? "" : LOGIN_REQUIRED_USERNAME_MESSAGE;
};

export const validateLoginPassword = (password: string) => {
  return password.trim() ? "" : LOGIN_REQUIRED_PASSWORD_MESSAGE;
};

export const createLoginPayload = (username: string, password: string) => {
  const usernameError = validateLoginUsername(username);
  const passwordError = validateLoginPassword(password);

  if (usernameError) {
    throw new Error(usernameError);
  }

  if (passwordError) {
    throw new Error(passwordError);
  }

  return {
    username: username.trim(),
    password,
  };
};