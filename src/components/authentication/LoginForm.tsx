import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Link,
  Heading,
  Text,
  Flex,
  VStack,
  SimpleGrid,
  GridItem,
  Alert,
  AlertIcon,
  Divider,
  Show,
  IconButton,
} from '@chakra-ui/react'

import { useAuth } from '@/context/AuthContext'
import TextField from '@/components/form/TextField'

import AuthPageLogo from './AuthenticationPageLogo'
import { FacebookOutlined } from '@ant-design/icons'

const LoginHeader = () => {
  return (
    <Box textAlign='center' w='full'>
      <Heading size='2xl' fontFamily='Shadows into light'>
        Sign In
      </Heading>
    </Box>
  )
}

const LoginForm = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={yup.object({
        email: yup
          .string()
          .email('Must be a valid email')
          .required('Email is required'),
        password: yup.string().required('Password is required'),
      })}
      onSubmit={async ({
        email,
        password,
      }: {
        email: string
        password: string
      }) => {
        try {
          setError('')
          setLoading(true)
          await login(email, password)
        } catch (error) {
          console.warn(error)
          setError('Failed to login. Please try again later')
        }

        setLoading(false)
        router.replace('/')
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid columns={2} columnGap={3} rowGap={6} w='full'>
            <GridItem colSpan={2}>
              <TextField
                name='email'
                placeholder='Please enter email'
                type='email'
              />
            </GridItem>
            <GridItem colSpan={2}>
              <TextField
                name='password'
                placeholder='Please enter password'
                type='password'
              />
            </GridItem>

            <GridItem colSpan={2}>
              <Button
                isLoading={loading}
                variant='primary'
                width='full'
                mt={4}
                type='submit'
              >
                Sign in
              </Button>
            </GridItem>
            {error && (
              <GridItem colSpan={2}>
                <Alert status='error'>
                  <AlertIcon />
                  {error}
                </Alert>
              </GridItem>
            )}
          </SimpleGrid>
        </form>
      )}
    </Formik>
  )
}

const LoginFooter = () => {
  const { loginWithFacebook } = useAuth()
  const handleFacebookLogin = async () => {
    await loginWithFacebook()
  }

  return (
    <Flex w='full' direction='column'>
      <Box textAlign='start' w='full'>
        <Link color={'teal.500'} href='/forgot-password'>
          Forgot your password?
        </Link>
      </Box>
      <Divider py={2} />
      <Box textAlign='end' w='full'>
        <Divider />
        <Text>
          Do not have an account yet?{' '}
          <Link color={'teal.500'} href='/register'>
            sign up
          </Link>
        </Text>
      </Box>
      <Box textAlign='end' w='full' display='flex' justifyContent='end' mt={2}>
        <Text mt={1}>Sign in with facebook</Text>
        <IconButton
          onClick={() => handleFacebookLogin()}
          aria-label='Sign up with facebook'
          icon={<FacebookOutlined />}
          colorScheme='blue'
          ml={2}
        />
      </Box>
    </Flex>
  )
}

const Login = () => {
  return (
    <Flex
      h={{ base: 'auto', md: '100vh' }}
      w='full'
      py={[0, 10, 20]}
      direction={{ base: 'column-reverse', md: 'row' }}
    >
      <Show above='md'>
        <AuthPageLogo />
      </Show>

      <VStack
        w='full'
        h='full'
        p={8}
        spacing={8}
        alignItems='center'
        justify='center'
        border={'1px'}
      >
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </VStack>
    </Flex>
  )
}

export default Login
