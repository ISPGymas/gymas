import { ExpandedUser } from '@/types';

export type AuthContextType = {
  currentUser: ExpandedUser | null;
  register: (...props: any) => any;
  login: (...props: any) => any;
  loginWithFacebook: (...props: any) => any;
  logout: (...props: any) => any;
  resetPassword: (...props: any) => any;
};
