import { GymClient, Trainer, Administrator } from '@/types';
import { User } from 'firebase/auth';

export type AuthContextType = {
  currentUser: ((User & { userInfo: GymClient | Trainer | Administrator | Object }) & { userType: string }) | null;
  register: (...props: any) => any;
  login: (...props: any) => any;
  loginWithFacebook: (...props: any) => any;
  logout: (...props: any) => any;
  resetPassword: (...props: any) => any;
};
