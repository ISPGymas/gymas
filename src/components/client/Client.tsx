import { GymClient, User, UserType } from '@/types';
import { Box, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../user/Avatar';
import CreateMealPlanModal from './CreateMealPlanModal';
import { firebaseDb } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const ClientComponent = ({ client }: { client: GymClient }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);


useEffect(() => {
    const getUser = async () => {
      const data = await getDoc(doc(firebaseDb, 'users', client?.userId as string));
      const userData = data?.data() as User;
      if (userData) {
        setUser({ ...userData, id: client.userId });
      }
    };

    getUser();
  }, [client]);

  return currentUser && client ? (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
      <Box p="6">
        <Avatar user={user!} />
        <Box mt="1" fontWeight="bold" as="h4" lineHeight="tight" noOfLines={1}>
            {user?.firstName} {user?.lastName}
        </Box>
        <Box>Age: {client.age}</Box>
      </Box>
      {currentUser?.userType === UserType.TRAINER && (
        <>
          <Box pt={2}>
            <CreateMealPlanModal client={client}></CreateMealPlanModal>
          </Box>
        </>
      )}
    </Box>
  ) : (
    <Heading>Something went wrong</Heading>
  );
};

export default ClientComponent;
