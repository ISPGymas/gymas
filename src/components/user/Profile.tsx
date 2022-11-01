import React from 'react'
import { useRouter } from 'next/router'
import {
  Center,
  Heading,
  Text,
  VStack,
  Divider,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'

import { User } from '@/types'
import { useAuth } from '@/context/AuthContext'

import Avatar from './Avatar'

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
          <Button variant='alarm' width='full' onClick={handleLogout}>
            Log out
          </Button>
        </VStack>
      </Center>
      <Divider p={10} />
    </>
  )
}

export default UserProfile
