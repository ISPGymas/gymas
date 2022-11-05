import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

import firebaseApp, { firebaseDb } from '@/firebase';
import { Administrator, AuthContextType, ExpandedUser, GymClient, Trainer, User, UserType } from '@/types';
import { Spinner } from '@chakra-ui/react';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { uploadFile } from '@/utils';

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  register: (): void => {},
  login: (): void => {},
  loginWithFacebook: (): void => {},
  logout: (): void => {},
  resetPassword: (): void => {},
});
const auth = getAuth(firebaseApp);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({
  children,
  isPageProtected,
  isAuthenticationPage,
}: {
  children: any;
  isPageProtected: boolean;
  isAuthenticationPage: boolean;
}) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<ExpandedUser | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initRendered, setInitRendered] = useState(false);

  const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const user = await signInWithPopup(auth, provider);
    const userRef = doc(firebaseDb, 'users', user.user.uid);
    const data = await getDoc(userRef);
    const userData = data.data();
    if (!userData) {
      const [firstName, lastName] = user.user.displayName?.split(' ') || [];
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.user.email,
        phone: user.user.phoneNumber,
      });
      if (user.user.photoURL) {
        const photo = await fetch(user.user.photoURL);
        const blob = await photo.blob();
        uploadFile({
          path: `avatars/${user.user.uid}`,
          file: blob,
        });
        updateDoc(userRef, {
          avatar: `avatars/${user.user.uid}`,
        });
      }
    }
    return user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      user ? setUserLoggedIn(true) : setUserLoggedIn(false);
      setInitRendered(true);

      if (!user) {
        return;
      }

      let userInfo;
      let userType;
      let userData;
      const getUser = async () => {
        const userDoc = await getDoc(doc(firebaseDb, 'users', user.uid as string));
        const userDocData = userDoc.data();
        if (userDocData) {
          userData = { ...userDocData, id: user.uid } as User;
        }
      };

      const getClient = async () => {
        const clientCollection = await getDocs(
          query(collection(firebaseDb, 'clients'), where('userId', '==', user.uid))
        );
        const clientDoc = clientCollection.docs[0];
        const clientData = clientDoc?.data() as GymClient;
        if (clientData) {
          userInfo = { ...clientData, id: clientDoc.id };
          userType = UserType.CLIENT;
        }
      };

      const getTrainer = async () => {
        const trainerCollection = await getDocs(
          query(collection(firebaseDb, 'trainers'), where('userId', '==', user.uid))
        );
        const trainerDoc = trainerCollection.docs[0];
        const trainerData = trainerDoc?.data() as Trainer;
        if (trainerData) {
          userInfo = { ...trainerData, id: trainerDoc.id };
          userType = UserType.TRAINER;
        }
      };

      const getAdmin = async () => {
        const adminCollection = await getDocs(query(collection(firebaseDb, 'admins'), where('userId', '==', user.uid)));
        const adminDoc = adminCollection.docs[0];
        const adminData = adminDoc?.data() as Administrator;
        if (adminData) {
          userInfo = { ...adminData, id: adminDoc.id };
          userType = UserType.ADMIN;
        }
      };

      await getUser();
      await getClient();
      await getTrainer();
      await getAdmin();

      const expandedUser = { ...user, userData, userInfo, userType };
      setCurrentUser(expandedUser);

      user ? setUserLoggedIn(true) : setUserLoggedIn(false);

      setInitRendered(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!initRendered) {
      return;
    }

    const checkRoutes = async () => {
      if (!userLoggedIn && isPageProtected) {
        await router.replace('/login');
        return;
      }

      if (userLoggedIn && isAuthenticationPage) {
        await router.replace('/');
        return;
      }

      setLoading(false);
    };

    checkRoutes();
  }, [userLoggedIn, isPageProtected, isAuthenticationPage, router, initRendered]);

  const value = {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    loginWithFacebook,
  };

  return <AuthContext.Provider value={value}>{!loading ? children : <Spinner />}</AuthContext.Provider>;
};
