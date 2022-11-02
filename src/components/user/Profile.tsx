import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Center,
  Heading,
  VStack,
  Divider,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'

import { GymClient, Trainer, User } from '@/types'
import { useAuth } from '@/context/AuthContext'

import Avatar from './Avatar'
import EditProfileModal from './EditProfileModal'
import { Membership, Reservation } from '@/types/gym'
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from 'firebase/firestore'
import { firebaseDb } from '@/firebase'

const UserProfile = ({ user }: { user: User }) => {
  const { logout } = useAuth()
  const router = useRouter()
  const [userClient, setUserClient] = useState<GymClient | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [userTrainers, setUserTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const retrieveData = async () => {
      const clientCollections = await getDocs(
        query(collection(firebaseDb, 'clients'), where('userId', '==', user.id))
      )
      const clientDoc = clientCollections.docs[0]
      const clientData = clientDoc?.data() as GymClient
      if (!clientData) {
        setLoading(false)
        return
      }

      setUserClient({ ...clientData, id: clientDoc.id })
      const reservationsCollections = await getDocs(
        query(
          collection(firebaseDb, 'reservations'),
          where('clientId', '==', clientDoc.id)
        )
      )
      const reservationsDocs = reservationsCollections.docs
      const allReservations = await Promise.all(
        reservationsDocs.map(async (doc) => {
          const reservationData = doc.data() as Reservation
          const newReservationData = { ...reservationData, id: doc.id }
          setReservations((currentValues) => [
            ...currentValues,
            newReservationData,
          ])
          return newReservationData
        })
      )
      const uniqueTrainerIds = [
        ...new Set(allReservations.map((res) => res.trainerId)),
      ]
      const trainersCollections = await getDocs(
        query(
          collection(firebaseDb, 'trainers'),
          where(documentId(), 'in', uniqueTrainerIds)
        )
      )
      const trainersDocs = trainersCollections.docs
      await Promise.all(
        trainersDocs.map(async (doc) => {
          const trainerData = doc.data() as Trainer
          setUserTrainers((currentValues) => [
            ...currentValues,
            { ...trainerData, id: doc.id },
          ])
        })
      )
      const membershipCollections = await getDocs(
        query(
          collection(firebaseDb, 'memberships'),
          where('clientId', '==', clientDoc.id)
        )
      )
      const membershipDocs = membershipCollections.docs
      await Promise.all(
        membershipDocs.map(async (doc) => {
          const membershipData = doc.data() as Membership
          setMemberships((currentValues) => [
            ...currentValues,
            { ...membershipData, id: doc.id },
          ])
        })
      )
      setLoading(false)
      return
    }

    retrieveData()
  }, [user.id])

  const handleLogout = async (event: any) => {
    event.preventDefault()
    await logout()

    router.replace('/login')
  }

  return (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          <EditProfileModal user={user} />
          <Button variant='alarm' width='full' onClick={handleLogout}>
            Log out
          </Button>
        </VStack>
      </Center>
      <Divider py={5} />
      <Center mt={5}>
        <Heading>Trainers history</Heading>
        <SimpleGrid
          columns={[1, 1, 2, 2, 3, 3]}
          templateRows={'masonry'}
        ></SimpleGrid>
      </Center>
    </>
  )
}

export default UserProfile
