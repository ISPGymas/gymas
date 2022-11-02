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
    </>
  )
}

export default UserProfile
