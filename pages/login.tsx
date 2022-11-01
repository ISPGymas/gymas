import type { NextPage } from 'next'

import LoginForm from '@/components/authentication/LoginForm'

const Login: NextPage = () => (
  <>
    <LoginForm />
  </>
)

export async function getServerSideProps() {
  return {
    props: {
      protected: false,
      authPage: true,
    },
  }
}

export default Login
