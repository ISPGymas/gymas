import { useEffect, useState } from 'react'
import { VStack, Image } from '@chakra-ui/react'

import { downloadFile } from '@/utils'
import { User } from '@/types'

const Avatar = ({ user }: { user: User | null }) => {
  const [avatar, setAvatar] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const retrieveUserAvatar = async () => {
      const avatarPath = user?.avatar || 'avatars/default.png'
      const avatar = await downloadFile(avatarPath)
      setAvatar(avatar)
      setIsLoading(false)
    }

    setIsLoading(true)
    retrieveUserAvatar()
  }, [user])

  return (
    <>
      {!isLoading ? (
        <VStack
          w='full'
          h='full'
          pt={10}
          pb={5}
          alignItems='center'
          justify='center'
        >
          <Image
            src={avatar}
            alt='Avatar'
            borderRadius='full'
            boxSize='150px'
            objectFit='cover'
          />
        </VStack>
      ) : null}
    </>
  )
}

export default Avatar
