export type SignupPathCount = {
  signupPath: string;
  label: string;
  signupCount: number;
  ratio: number;
  color: string;
};

export type SignupPathSummary = {
  totalSignupCount: number;
  totalNetSales: number;
  bestEfficiencyPathLabel: string;
  bestEfficiencyPathArpu: number;
};

export type SignupPathChannelRevenue = {
  signupPath: string;
  label: string;
  signupCount: number;
  netSales: number;
  arpu: number;
  color: string;
};
