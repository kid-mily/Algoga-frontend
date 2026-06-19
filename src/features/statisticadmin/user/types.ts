export type SignupPathStatistic = {
  signupPath: string;
  label: string;
  signupCount: number;
  ratio: number;
  color: string;
};

export type SignupPathSummary = {
  totalSignupCount: number;
  pathCount: number;
  topPathLabel: string;
  topPathRatio: number;
};
