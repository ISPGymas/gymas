import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
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
  Show,
} from '@chakra-ui/react'

import { useAuth } from '@/context/AuthContext'
import TextField from '@/components/form/TextField'

import AuthPageLogo from './AuthenticationPageLogo'

const ForgotPasswordHeader = () => {
  return (
    <Box textAlign='center' w='full'>
      <Heading size='2xl' fontFamily='Shadows into light'>
        Recover Password
      </Heading>
    </Box>
  )
}

const ForgotPasswordForm = () => {
  const { resetPassword } = useAuth()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={yup.object({
        email: yup
          .string()
          .email('Must be a valid email')
          .required('Email is required'),
      })}
      onSubmit={async ({ email }: { email: string }) => {
        try {
          setError('')
          setLoading(true)
          await resetPassword(email)
        } catch (error) {
          console.warn(error)
          setError('Failed to reset password. Please try again later')
        }

        setLoading(false)
        setMessage(
          `Check your email for instructions on how to recover you password. Email usually arrives within 5 minutes`
        )
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
              <Button
                isLoading={loading}
                variant='primary'
                width='full'
                mt={4}
                type='submit'
              >
                Reset password
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
            {message && (
              <GridItem colSpan={2}>
                <Alert status='success'>
                  <AlertIcon />
                  {message}
                </Alert>
              </GridItem>
            )}
          </SimpleGrid>
        </form>
      )}
    </Formik>
  )
}

const ForgotPasswordFooter = () => {
  return (
    <Flex w='full' direction='row'>
      <Box textAlign='start' w='full'>
        <Text>
          Do not have an account yet?
          <Link color={'teal.500'} pl={2} href='/register'>
            sign up
          </Link>
        </Text>
      </Box>
      <Box textAlign='end' w='full'>
        <Text>
          Remembered your password?
          <Link color={'teal.500'} pl={2} href='/login'>
            sign in
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}

const ForgotPassword = () => {
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
        <ForgotPasswordHeader />
        <ForgotPasswordForm />
        <ForgotPasswordFooter />
      </VStack>
    </Flex>
  )
}

export default ForgotPassword
