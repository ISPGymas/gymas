import { VStack, Image } from '@chakra-ui/react'

const AuthPageLogo = () => {
  return (
    <VStack w='full' h='full' py={0} spacing={10} alignItems='flext-start'>
      <Image src='/gym.jpg' alt='' boxSize='100%' objectFit='cover' />
    </VStack>
  )
}

export default AuthPageLogo
