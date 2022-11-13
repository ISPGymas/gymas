import { Timestamp } from 'firebase/firestore';

export enum MembershipType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export enum MembershipStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
}

export type Membership = {
  id: string;
  clientId: string;
  end_date: Timestamp;
  start_date: Timestamp;
  status: MembershipStatus;
  type: MembershipType;
};

export type Reservation = {
  id: string;
  clientId: string;
  trainerId: string;
  workoutId: string;
  end_date: Date;
  start_date: Date;
};