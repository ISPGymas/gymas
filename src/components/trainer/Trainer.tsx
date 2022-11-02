import { Trainer, User } from '@/types'
import { Box, Heading } from '@chakra-ui/react'
import Avatar from '@/components/user/Avatar'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { firebaseDb } from '@/firebase'

const TrainerComponent = ({ trainer }: { trainer: Trainer }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const data = await getDoc(
        doc(firebaseDb, 'users', trainer?.userId as string)
      )
      const userData = data?.data() as User
      if (userData) {
        setUser({ ...userData, id: trainer.userId })
      }
    }

    getUser()
  }, [trainer])
  return user && trainer ? (
    <Box maxW='md' borderWidth='1px' borderRadius='lg' overflow='hidden' m={2}>
      <Box>
        <Avatar user={user} />
      </Box>

      <Box p='6'>
        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {`${user.firstName} ${user.lastName}`}
        </Box>

        <Box>
          {trainer.experience}
          <Box as='span' color='gray.600' fontSize='sm'>
            years of experience
          </Box>
        </Box>

        <Box>
          {trainer.education}
          <Box as='span' color='gray.600' fontSize='sm'>
            education level
          </Box>
        </Box>
        <Box>
          <Heading size='md'>Contact information</Heading>
          <Box>
            <Heading size='xs'>{user.email}</Heading>
            <Heading size='xs'>{user.phone}</Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <Heading>Something went wrong</Heading>
  )
}

export default TrainerComponent
