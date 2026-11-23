import type { IPremiumUser } from "./payment.types";

export interface ICustomerAnalytics {
    outages: {
      total: number;
      reported: number;
      assigned: number;
      inProgress: number;
      resolved: number;
    };
    subscriptions: {
      active: IPremiumUser[];
      totalExpired: number;
      totalCancelled: number;
    };
    payments: {
      totalAmountSpent: number;
      totalPaidPayments: number;
    };
}

export interface ITechnicianAnalytics {
  unexpectedOutages: {
    total: number;
    assigned: number;
    inProgress: number;
    resolved: number;
  };
  scheduledOutages: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
  };
  totalAssignments: number;
  pendingAssignments: number;
  resolvedAssignments: number;
}