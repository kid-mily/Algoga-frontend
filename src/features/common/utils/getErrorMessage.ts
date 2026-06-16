type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  if (typeof error === "string") {
    return error || fallbackMessage;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as ErrorWithResponse;
    return apiError.response?.data?.message || apiError.message || fallbackMessage;
  }

  return fallbackMessage;
};
