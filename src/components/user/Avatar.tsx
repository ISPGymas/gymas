import { ChangeEvent, useEffect, useState } from 'react'
import { VStack, Image } from '@chakra-ui/react'
import { doc, updateDoc } from 'firebase/firestore'

import { downloadFile, uploadFile } from '@/utils'
import { User } from '@/types'
import { firebaseDb } from '@/firebase'
import PhotoField from '@/components/form/PhotoInput'

const Avatar = ({ user }: { user: User }) => {
  const [avatar, setAvatar] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const userRef = doc(firebaseDb, 'users', user.id)

  useEffect(() => {
    const retrieveUserAvatar = async () => {
      const avatarPath = user.avatar || 'avatars/default.png'
      const avatar = await downloadFile(avatarPath)
      setAvatar(avatar)
      setIsLoading(false)
    }

    setIsLoading(true)
    retrieveUserAvatar()
  }, [user])

  const onAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile({
        path: `avatars/${user.id}`,
        file: e.target.files[0],
      })
      updateDoc(userRef, {
        avatar: `avatars/${user.id}`,
      })
    }
  }

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
          Choose Avatar
          <PhotoField name={'avatar'} onChange={onAvatarUpload} />
        </VStack>
      ) : null}
    </>
  )
}

export default Avatar
