export type ApplicationState =
  | "open"
  | "outstanding"
  | "repaid"
  | "cancelled"
  | "rejected";

export interface Application {
  applicationId: string;
  userId: string;
  requestedAmount: number;
  applicationState: ApplicationState;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationRequest {
  userId: string;
  requestedAmount: number;
}

export interface DisburseApplicationRequest {
  applicationId: string;
  expressDelivery?: boolean;
  tip?: number;
}

export interface RepayApplicationRequest {
  applicationId: string;
  amount: number;
}

export interface CancelApplicationRequest {
  applicationId: string;
}

export interface RejectApplicationRequest {
  applicationId: string;
}

export interface ReleaseFundsRequest {
  count: number;
}
