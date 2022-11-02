import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '@/context/AuthContext'
import { protectRoute } from '@/utils'
import { Administrator, GymClient, Trainer } from '@/types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firebaseDb } from '@/firebase'
import { Spinner } from '@chakra-ui/react'
import BecomeClientModal from '@/components/gymClient/BecomeClientModal'

const Home: NextPage = () => {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<Administrator | null>(null)
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [client, setClient] = useState<GymClient | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login')
      return
    }

    const getClient = async () => {
      const clientCollection = await getDocs(
        query(
          collection(firebaseDb, 'clients'),
          where('userId', '==', currentUser.uid)
        )
      )
      const clientDoc = clientCollection.docs[0]
      const clientData = clientDoc?.data() as GymClient
      if (clientData) {
        setClient({ ...clientData, id: clientDoc.id })
        setLoading(false)
      }
    }

    const getTrainer = async () => {
      const trainerCollection = await getDocs(
        query(
          collection(firebaseDb, 'trainers'),
          where('userId', '==', currentUser.uid)
        )
      )
      const trainerDoc = trainerCollection.docs[0]
      const trainerData = trainerDoc?.data() as Trainer
      if (trainerData) {
        setTrainer({ ...trainerData, id: trainerDoc.id })
        setLoading(false)
      }
    }

    const getAdmin = async () => {
      const adminCollection = await getDocs(
        query(
          collection(firebaseDb, 'admins'),
          where('userId', '==', currentUser.uid)
        )
      )
      const adminDoc = adminCollection.docs[0]
      const adminData = adminDoc?.data() as Administrator
      if (adminData) {
        setAdmin({ ...adminData, id: adminDoc.id })
        setLoading(false)
      }
    }

    getClient()
    getTrainer()
    getAdmin()
  }, [currentUser, router])

  useEffect(() => {
    protectRoute(currentUser, router)
    setLoading(false)
  }, [currentUser, router])

  if (loading) {
    return <Spinner />
  }

  if (!client && !trainer && !admin) {
    return <BecomeClientModal userId={currentUser!.uid} />
  }

  return <div>Hello world</div>
}

export async function getServerSideProps() {
  return {
    props: {
      protected: true,
    },
  }
}

export default Home
