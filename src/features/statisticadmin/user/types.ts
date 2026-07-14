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
  ratio: number;
  netSales: number;
  arpu: number;
  bookingCount: number;
  bookingConversionRate: number;
  color: string;
};
