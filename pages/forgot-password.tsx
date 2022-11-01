import type { NextPage } from 'next'

import ForgotPasswordForm from '@/components/authentication/ForgotPasswordForm'

const ForgotPassword: NextPage = () => (
  <>
    <ForgotPasswordForm />
  </>
)

export async function getServerSideProps() {
  return {
    props: {
      protected: false,
    },
  }
}

export default ForgotPassword
