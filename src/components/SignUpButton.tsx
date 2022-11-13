import { Flex, Box, Input } from '@chakra-ui/react'
import { HomeOutlined } from '@ant-design/icons'
import { useAuth } from '@/context/AuthContext'
import { ButtonLink } from './Menu'
import { string } from 'yup'

function SignUpButton() {
  const { currentUser } = useAuth()
  return (
    <Flex bgColor='azure' w='full' justify='center'>
      {currentUser ? (
        <Flex bgColor='azure' w='60%' justifyContent='space-between'>
          <Box> Sign Up
          </Box>
        </Flex>
      ) : null}
    </Flex>
  )
}

export default SignUpButton
