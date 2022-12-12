import { Timestamp } from 'firebase/firestore';
import { string } from 'yup';

export enum MembershipType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export enum MembershipStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
}

export enum WorkoutType {
  GROUP = 'Group',
  SOLO = 'Solo',
}

export enum Goal {
  WEIGHTLOSS = 'Weightloss',
  MUSCLE = 'Muscle',
  MAINTAIN = 'Maintain'
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

export type Workout = {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  price: number;
  locationId: string;
  groupSize: number;
  reserved: number;
};

export type WorkoutLocation = {
  id: String;
  addressId: String;
  area: number;
  description: String;
  name: String;
};

export type WorkoutAddress = {
  buildingNr: string | number;
  city: string;
  country: string;
  disctrict: string;
  street: string;
  zipCode: string;
};


export type MealPlan = {
  clientId: string,
  goal: Goal,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fibre: number,
  sugarRatio: number,
  allergies: string,
}