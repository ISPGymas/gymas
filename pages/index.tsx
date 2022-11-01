import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '@/context/AuthContext'
import { protectRoute } from '@/utils'

const Home: NextPage = () => {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    protectRoute(currentUser, router)
    setLoading(false)
  }, [currentUser, router])

  return !loading && currentUser ? <>Hello world</> : null
}

export async function getServerSideProps() {
  return {
    props: {
      protected: true,
    },
  }
}

export default Home
