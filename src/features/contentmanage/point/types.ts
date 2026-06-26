export interface PointHistory {
  pointId?: number;
  mileageId?: number;
  userId: number;
  amount: number;
  type?: string;
  reason: string;
  createdAt: string;
}

export interface StudentPointInfo {
  userId: number;
  userName: string;
  email: string;
  totalPoint: number;
}

export interface PointPayload {
  userId: number;
  amount: number;
  reason: string;
}

export type SelectedPointStudent = {
  userId: number;
  name: string;
  point: number;
};

export type PointAdjustMode = "give" | "recall";

export type StudentPointRecord = {
  userId: number;
  userName?: string;
  name?: string;
  nickname?: string;
  email: string;
  totalMileage?: number;
  mileage?: number;
};

export type MileageUsersResponse =
  | { users: StudentPointRecord[] }
  | { content: StudentPointRecord[] };

export type PointHistoryResponse = {
  content: PointHistory[];
};
