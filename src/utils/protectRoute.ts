import { User } from 'firebase/auth'
import type { NextRouter } from 'next/router'

export const protectRoute = (currentUser: User | null, router: NextRouter) => {
  if (!currentUser) {
    router.replace('/login')
  }
}
