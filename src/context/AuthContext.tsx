import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth'

import firebaseApp, { firebaseDb } from '@/firebase'
import { AuthContextType } from '@/types'
import { Spinner } from '@chakra-ui/react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { uploadFile } from '@/utils'

const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
  register: (): void => {},
  login: (): void => {},
  loginWithFacebook: (): void => {},
  logout: (): void => {},
  resetPassword: (): void => {},
})
const auth = getAuth(firebaseApp)

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({
  children,
  isPageProtected,
  isAuthenticationPage,
}: {
  children: any
  isPageProtected: boolean
  isAuthenticationPage: boolean
}) => {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initRendered, setInitRendered] = useState(false)

  const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const user = await signInWithPopup(auth, provider)
    const userRef = doc(firebaseDb, 'users', user.user.uid)
    const data = await getDoc(userRef)
    const userData = data.data()
    if (!userData) {
      const [firstName, lastName] = user.user.displayName?.split(' ') || []
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.user.email,
        phone: user.user.phoneNumber,
      })
      if (user.user.photoURL) {
        const photo = await fetch(user.user.photoURL)
        const blob = await photo.blob()
        uploadFile({
          path: `avatars/${user.user.uid}`,
          file: blob,
        })
        updateDoc(userRef, {
          avatar: `avatars/${user.user.uid}`,
        })
      }
    }
    return user
  }

  const logout = () => {
    return signOut(auth)
  }

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      user ? setUserLoggedIn(true) : setUserLoggedIn(false)

      setInitRendered(true)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!initRendered) {
      return
    }

    const checkRoutes = async () => {
      if (!userLoggedIn && isPageProtected) {
        await router.replace('/login')
        return
      }

      if (userLoggedIn && isAuthenticationPage) {
        await router.replace('/')
        return
      }

      setLoading(false)
    }

    checkRoutes()
  }, [
    userLoggedIn,
    isPageProtected,
    isAuthenticationPage,
    router,
    initRendered,
  ])

  const value = {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    loginWithFacebook,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Spinner />}
    </AuthContext.Provider>
  )
}
