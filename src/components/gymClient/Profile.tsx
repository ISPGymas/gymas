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

import Avatar from '@/components/user/Avatar'
import { Membership, Reservation } from '@/types/gym'
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { firebaseDb } from '@/firebase'
import EditClientProfileModal from './EditProfileModal'

const GymClientProfile = ({
  client,
  user,
}: {
  client: GymClient
  user: User
}) => {
  const { logout } = useAuth()
  const router = useRouter()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [userTrainers, setUserTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async (event: any) => {
    event.preventDefault()
    await logout()

    router.replace('/login')
  }

  useEffect(() => {
    const retrieveData = async () => {
      const reservationsCollections = await getDocs(
        query(
          collection(firebaseDb, 'reservations'),
          where('clientId', '==', client.id)
        )
      )
      const reservationsDocs = reservationsCollections.docs
      const allReservations = await Promise.all(
        reservationsDocs.map(async (doc) => {
          const reservationData = doc.data() as Reservation
          return { ...reservationData, id: doc.id }
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
          where('clientId', '==', client.id)
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
  }, [client])

  return (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          <EditClientProfileModal user={user} client={client} />
          <Button variant='alarm' width='full' onClick={handleLogout}>
            Log out
          </Button>
        </VStack>
      </Center>
      <Divider py={5} />
      <Center mt={5}>
        <Heading>Memberships</Heading>
        <SimpleGrid
          columns={[1, 1, 2, 2, 3, 3]}
          templateRows={'masonry'}
        ></SimpleGrid>
      </Center>
      <Divider py={5} />
      <Center mt={5}>
        <Heading>Trainers history</Heading>
        <SimpleGrid
          columns={[1, 1, 2, 2, 3, 3]}
          templateRows={'masonry'}
        ></SimpleGrid>
      </Center>
      <Divider py={5} />
    </>
  )
}

export default GymClientProfile
