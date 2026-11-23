import type { IMeta } from "./common.types";
import type { IUnexpectedOutage } from "./outage.types";
import type { IScheduledOutage } from "./scheduled-outage.types";

export interface TechnicianApplicationData {
  user: {
    name: string;
    email: string;
  };
  technician: {
    address?: string;
    experienceYears: number;
    bio?: string;
    contactNumber?: string;
  };
}

export interface TechnicianApplicationPayload {
  resume: File;
  data: TechnicianApplicationData;
}

export interface UpdateTechnicianProfilePayload {
  address?: string;
  bio?: string;
  contactNumber?: string;
  experienceYears?: number;
}


export interface IAssignments {
  unexpectedOutages: IUnexpectedOutage[];
  scheduledOutages: IScheduledOutage[];
}

export interface IAssignmentsMeta extends IMeta {
  unexpectedTotal: number;
  scheduledTotal: number;
  totalAssignments: number;
}

export interface IAssignmentsResponse {
  data: IAssignments;
  meta: IAssignmentsMeta;
}

export interface UpdateOutageStatusPayload {
  status: "IN_PROGRESS" | "RESOLVED";
  note?: string;
}

export interface ITechnicianProfile {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  experienceYears: number;
  bio?: string;
  address?: string;
}