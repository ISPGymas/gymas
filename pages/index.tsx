import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from '@/context/AuthContext';
import { protectRoute } from '@/utils';
import { Spinner } from '@chakra-ui/react';
import BecomeClientModal from '@/components/gymClient/BecomeClientModal';

const Home: NextPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }
  }, [currentUser, router]);

  useEffect(() => {
    protectRoute(currentUser, router);
    setLoading(false);
  }, [currentUser, router]);

  if (loading) {
    return <Spinner />;
  }

  if (currentUser && !currentUser.userType) {
    return <BecomeClientModal userId={currentUser!.uid} />;
  }

  return <div>Hello world</div>;
};

export async function getServerSideProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default Home;
