import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from '@firebase/firestore';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Spinner } from '@chakra-ui/react';

import type { Administrator, GymClient, Trainer, User } from '@/types';
import { firebaseDb } from '@/firebase';
import UserProfile from '@/components/user/Profile';
import { collection, getDocs, query, where } from 'firebase/firestore';
import AdminProfile from '@/components/admin/Profile';
import GymClientProfile from '@/components/gymClient/Profile';
import TrainerProfile from '@/components/trainer/Profile';
import { useAuth } from '@/context/AuthContext';

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();
  const userOwnsProfile = currentUser?.uid === id;
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Administrator | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [client, setClient] = useState<GymClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const data = await getDoc(doc(firebaseDb, 'users', id as string));
      const userData = data.data();
      if (!userData) {
        return userOwnsProfile ? router.replace('/login') : setError(true);
      }

      setUser({ ...userData, id } as User);
    };

    const getClient = async () => {
      const clientCollection = await getDocs(query(collection(firebaseDb, 'clients'), where('userId', '==', id)));
      const clientDoc = clientCollection.docs[0];
      const clientData = clientDoc?.data() as GymClient;
      if (clientData) {
        setClient({ ...clientData, id: clientDoc.id });
        setAdmin(null);
        setTrainer(null);
        setLoading(false);
      }
    };

    const getTrainer = async () => {
      const trainerCollection = await getDocs(query(collection(firebaseDb, 'trainers'), where('userId', '==', id)));
      const trainerDoc = trainerCollection.docs[0];
      const trainerData = trainerDoc?.data() as Trainer;
      if (trainerData) {
        setTrainer({ ...trainerData, id: trainerDoc.id });
        setAdmin(null);
        setClient(null);
        setLoading(false);
      }
    };

    const getAdmin = async () => {
      const adminCollection = await getDocs(query(collection(firebaseDb, 'admins'), where('userId', '==', id)));
      const adminDoc = adminCollection.docs[0];
      const adminData = adminDoc?.data() as Administrator;
      if (adminData) {
        setAdmin({ ...adminData, id: adminDoc.id });
        setClient(null);
        setTrainer(null);
        setLoading(false);
      }
    };

    getUser();
    getClient();
    getTrainer();
    getAdmin();
  }, [id, router, userOwnsProfile]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Profile does not exist!</AlertTitle>
        <AlertDescription>Could not find the profile.</AlertDescription>
      </Alert>
    );
  }

  if (client) {
    return <GymClientProfile user={user!} client={client} />; // client profile
  } else if (trainer) {
    return <TrainerProfile user={user!} trainer={trainer} />;
  } else if (admin) {
    return <AdminProfile user={user!} admin={admin} />; // admin profile
  } else {
    return <UserProfile user={user!} />; // user profile
  }
};

export async function getServerSideProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default User;
